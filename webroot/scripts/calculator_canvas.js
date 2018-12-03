// Declare namespace
calculator_canvas = function ()
{
	var self = {};
	
	self.setupWebGL = function ()
	{
		// Both fundamental GLSL shaders that WebGl uses to render vertices to the canvas element
		// Vertex shader handles the corners of polygons being rendered to the canvas and then sends this data to the fragment shader
		var vertexShader = self.createShader(gl.VERTEX_SHADER, document.getElementById("vertexShader").text);
		// Fragment shader takes vertex shader output and renders the pixels between each vertice to create a filled shape of specified color(s).
		var fragmentShader = self.createShader(gl.FRAGMENT_SHADER, document.getElementById("fragmentShader").text);
		
		// WebGL shader program which links the vertex and fragment shaders, and allows them to be used by the GPU
		program = self.createProgram(vertexShader, fragmentShader);
		
		// An object for storing vertices
		vertexBufferObject = gl.createBuffer();
		// This links the VBO to the array buffer in the GPU
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
		
		// This tells the shader program what attributes to expect, what data types they will be, how many bytes long etc.
		self.prepareAttributes();
		
		// Add the axes to the list of vertices
		staticVertices = self.declareStaticVertices();
		temporaryVertices = [];
	};
	
	// Converts canvas values (pixels) to clipspace values (-1 to 1)
	self.canvasYToClipspace = function (y)
	{
		var canvas = document.getElementById("canvas");
		var canvasRect = canvas.getBoundingClientRect();
		console.log(canvasRect);
		
		var yOnGraph = y - canvasRect.y;
		// Divide y by the height of the graph, and then *2 -1 to make the value between 1 and -1.
		// It must also be multiplied by -1 to account for the fact that the top left corner of the canvas is the point (-1,1) because y coordinates are reversed.
		var yRelative = -(yOnGraph / canvasRect.height * 2 - 1);
		
		return yRelative;
	};
	
	self.canvasXToClipspace = function (x)
	{
		var canvas = document.getElementById("canvas");
		var canvasRect = canvas.getBoundingClientRect();
		
		var xOnGraph = x - canvasRect.x;
		// Divide x by the width of the graph, and then *2 -1 to make the value between 1 and -1
		var xRelative = xOnGraph / canvasRect.width * 2 - 1;
		
		return xRelative;
	};
	
	// Registers functions to events listeners for handling all mouse events on the canvas
	self.registerMouseEvents = function ()
	{
		var canvas = document.getElementById("canvas");
		
		mouseDown = false;
		canvas.onmousedown = self.mouseDown;
		canvas.onmouseup = self.mouseUp;
		canvas.onmousemove = self.mouseMove;
	};
	
	// Handles mouse events
	self.mouseDown = function (event)
	{
		mouseDownX = event.clientX;
		mouseDownY = event.clientY;
		mouseDown = true;
	};
	
	self.mouseUp = function (event)
	{
		mouseX = self.canvasXToClipspace(event.clientX);
		mouseY = self.canvasYToClipspace(event.clientY);
		mouseDown = false;

		self.createPolygon([mouseX, mouseY], 10, 0.03, [255/255, 80/255, 0/255, 255/255], false);
	};
	
	// Create a new shader of the specified type
	self.createShader = function (type, source)
	{
		var shader = gl.createShader(type);
		
		// Compiles the shader
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		
		// If there was an error while compiling, log to the console
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{
			console.error("Shader failed to compile", gl.getShaderInfoLog(shader));
			return false;
		}
		
		return shader;
	};
	
	// Create a program using a vertex and fragment shader
	self.createProgram = function (vertexShader, fragmentShader)
	{
		var program = gl.createProgram();
		
		// Attatch the vertex and fragment shaders to the program
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		
		// Create a program from the two shaders
		gl.linkProgram(program);
		
		return program;
	};
	
	// Prepare the attributes in the program to be interfaced by the rest of the program
	self.prepareAttributes = function ()
	{
		// 2 position elements per vertice (x, y)
		var positionElements = 2;
		// 4 color elements per vertice (red, green, blue, alpha)
		var colorElements = 4;
		// The total number of elements per vertice (in this case 2 + 4)
		totalElements = positionElements + colorElements;
		
		// Queries the program for the index of the position attribute
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.vertexAttribPointer(positionAttributeLocation, positionElements, gl.FLOAT, gl.FALSE, totalElements * Float32Array.BYTES_PER_ELEMENT, 0);
		
		// Queries the program for the index of the vertex color attribute
		var colorAttributeLocation = gl.getAttribLocation(program, "a_vert_color");
		gl.vertexAttribPointer(colorAttributeLocation, colorElements, gl.FLOAT, gl.FALSE, totalElements * Float32Array.BYTES_PER_ELEMENT, positionElements * Float32Array.BYTES_PER_ELEMENT);
		
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.enableVertexAttribArray(colorAttributeLocation);
	};
	
	// Rotates a 2D point about 0,0 by the specified angle
	self.rotateVertice = function (vertice, angle)
	{
		var rotatedVertice = [];
		rotatedVertice[0] = (vertice[0]) * Math.cos(angle) - (vertice[1]) * Math.sin(angle);
		rotatedVertice[1] = (vertice[0]) * Math.sin(angle) + (vertice[1]) * Math.cos(angle);
		
		return rotatedVertice;
	};
	
	// Translates a 2D point by a certain amount horizontally and vertically
	self.translateVertice = function (vertice, translation)
	{
		vertice[0] += translation[0];
		vertice[1] += translation[1];
		
		return vertice;
	};
	
	// Keeps drawing triangles until we run out of vertices
	self.drawTriangles = function (vertices)
	{
		if (vertices.length >= totalElements*3)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			gl.drawArrays(gl.TRIANGLES, 0, vertices.length/totalElements);
		}
	};
	
	// Generates vertices for any polygon
	self.createPolygon = function (origin, sides, radius, color, constrainToAxes)
	{
		// Makes sure that you cannot draw outside the axes
		if (constrainToAxes)
		{
			origin[0] *= axisWidth;
			origin[1] *= axisWidth;
		}
		
		var centralAngle = 2*Math.PI/sides;
		
		var s = 0;
		while (s < sides)
		{
			// Stores the current triangular fragment of the polygon before it is added to the vertices
			var currentTriangle = [];
			
			currentTriangle[0] = [0, 0];
			currentTriangle[1] = self.rotateVertice([0, radius], centralAngle/2);
			currentTriangle[2] = self.rotateVertice([0, radius], -centralAngle/2);
			
			var t = 0;
			while (t < 3)
			{
				currentTriangle[t] = self.rotateVertice(currentTriangle[t], centralAngle*s);
				currentTriangle[t] = self.translateVertice(currentTriangle[t], [origin[0],origin[1]]);
				currentTriangle[t] = currentTriangle[t].concat(color);
				temporaryVertices = temporaryVertices.concat(currentTriangle[t]);
				
				t += 1;
			}
			
			s += 1;
		}
	};
	
	// Declares all the static vertices that will be drawn
	self.declareStaticVertices = function ()
	{
		var vertices = [];
		
		// Properties of the axis lines (axisWidth is global because it is used to scale polygons within the axes)
		var axisThickness = 0.01;
		axisWidth = 0.9;
		var axisColor = [0/255, 0/255, 0/255, 255/255];
		
		// X axis made of two triangles
		vertices = vertices.concat([-axisWidth,  axisThickness]).concat(axisColor);
		vertices = vertices.concat([-axisWidth, -axisThickness]).concat(axisColor);
		vertices = vertices.concat([ axisWidth,  axisThickness]).concat(axisColor);
		
		vertices = vertices.concat([ axisWidth,  axisThickness]).concat(axisColor);
		vertices = vertices.concat([ axisWidth, -axisThickness]).concat(axisColor);
		vertices = vertices.concat([-axisWidth, -axisThickness]).concat(axisColor);
		
		// Y axis made of two triangles
		vertices = vertices.concat([ axisThickness, -axisWidth]).concat(axisColor);
		vertices = vertices.concat([-axisThickness, -axisWidth]).concat(axisColor);
		vertices = vertices.concat([ axisThickness,  axisWidth]).concat(axisColor);
		
		vertices = vertices.concat([ axisThickness,  axisWidth]).concat(axisColor);
		vertices = vertices.concat([-axisThickness,  axisWidth]).concat(axisColor);
		vertices = vertices.concat([-axisThickness, -axisWidth]).concat(axisColor);
		
		return vertices;
	};
	
	// Render loop called every frame update
	self.render = function ()
	{
		gl.useProgram(program);
		
		// Proprietary function from stackoverflow for testing. Will be replaced with own function soon.
		function hexToRgb(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}
		
		// Gets the color of the graph background from the css variable and converts it from hex to rbg
		var rgbBackground = hexToRgb(document.body.style.getPropertyValue("--theme-color-page-background-light"));
		
		// Clears the screen with the background color and temporary buffers
		gl.clearColor(rgbBackground.r/255, rgbBackground.g/255, rgbBackground.b/255, 255/255);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		// Draws both static and temporary vertices
		self.drawTriangles(staticVertices);
		self.drawTriangles(temporaryVertices);
		
		// Render the next frame
		requestAnimationFrame(self.render);
	};
	
	return self;
}();