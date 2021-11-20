// Declare namespace
calculator_canvas = function ()
{
	var self = {};
	
	// Converts a hexadecimal value to an RBG object using a RegEx search
	self.hexToRgb = function (hex)
	{
		// Matches 3 sets of number/character pairs
		var regex = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i;

		// Execute the above regex on the input hex value
		var match = regex.exec(hex);
		
		// If there is no match to the colour return a null value
		if (match == null)
		{
			return null;
		}
		
		// Get the red value in base 16
		var redHex = match[1];
		// Parse it to an integer from base 16
		var redDecimal = parseInt(redHex, 16);
		
		// Get the green value in base 16
		var greenHex = match[2];
		// Parse it to an integer from base 16
		var greenDecimal = parseInt(greenHex, 16);
		
		// Get the green value in base 16
		var blueHex = match[3];
		// Parse it to an integer from base 16
		var blueDecimal = parseInt(blueHex, 16);
		
		// Return an object containing the RGB values
		return {
			"r": redDecimal,
			"g": greenDecimal,
			"b": blueDecimal
		};
	};
	
	// Sets up all the necessary components of the WebGL framework for use on the calculator graph
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
		// Gets a DOM refernce to the canvas
		var canvas = document.getElementById("canvas");

		// Gets the canvas dimensions
		var canvasRect = canvas.getBoundingClientRect();
		
		// Get the vertical position in pixels, from the top edge of the canvas
		var yOnGraph = y - canvasRect.y;

		// Divide y by the height of the graph, and then *2 -1 to make the value between 1 and -1.
		// It must also be multiplied by -1 to account for the fact that the top left corner of the canvas is the point (-1,1) because y coordinates are reversed.
		var yRelative = -(yOnGraph / canvasRect.height * 2 - 1);
		
		return yRelative;
	};
	
	self.canvasXToClipspace = function (x)
	{
		// Gets a DOM refernce to the canvas
		var canvas = document.getElementById("canvas");

		// Gets the canvas dimensions
		var canvasRect = canvas.getBoundingClientRect();
		
		// Get the horizontal position in pixels from the left edge of the canvas 
		var xOnGraph = x - canvasRect.x;

		// Divide x by the width of the graph, and then *2 -1 to make the value between 1 and -1
		var xRelative = xOnGraph / canvasRect.width * 2 - 1;
		
		return xRelative;
	};
	
	// Registers functions to events listeners for handling all mouse events on the canvas
	self.registerMouseEvents = function ()
	{
		// Gets a DOM refernce to the canvas
		var canvas = document.getElementById("canvas");
		
		// Boolean to register if the primary mouse key is being held down
		mouseDown = false;

		// Registers the event listeners
		canvas.onmousedown = self.mouseDown;
		canvas.onmouseup = self.mouseUp;
		canvas.onmousemove = self.mouseMove;
	};
	
	// Handles mouse events
	self.mouseDown = function (event)
	{
		// Stores the position of the mouse when it was clicked
		mouseDownX = event.clientX;
		mouseDownY = event.clientY;

		// Register it being pressed down
		mouseDown = true;
	};
	
	self.mouseUp = function (event)
	{
		// Gets the relative position of the mouse to the canvas when its button is released
		mouseX = self.canvasXToClipspace(event.clientX);
		mouseY = self.canvasYToClipspace(event.clientY);

		// Register the mousse button being released
		mouseDown = false;

		// Gets the main theme colour and converts it from hex to rbg
		var pinColorObject = self.hexToRgb(document.body.style.getPropertyValue("--theme-color-main"));
		
		// Creates a small circle (10 sided polygon) where the user pressed
		// Uses the main theme colour of the page as the circle colour
		self.createPolygon([mouseX, mouseY], 10, 0.03, [pinColorObject.r/255, pinColorObject.g/255, pinColorObject.b/255, 255/255], false);
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
		// Array to store the results of the rotation
		var rotatedVertice = [];

		// Applies the rotation to the x coordinate
		rotatedVertice[0] = (vertice[0]) * Math.cos(angle) - (vertice[1]) * Math.sin(angle);
		// Applies the rotation to the y coordinate
		rotatedVertice[1] = (vertice[0]) * Math.sin(angle) + (vertice[1]) * Math.cos(angle);
		
		return rotatedVertice;
	};
	
	// Translates a 2D point by a certain amount horizontally and vertically
	self.translateVertice = function (vertice, translation)
	{
		// Adds the translation values to the values stored in the vertice
		vertice[0] += translation[0];
		vertice[1] += translation[1];
		
		return vertice;
	};
	
	// Keeps drawing triangles until we run out of vertices
	self.drawTriangles = function (vertices)
	{
		// Checks that there are at least 3 vertices
		// This is the minimum amount required to draw a single triangle
		if (vertices.length >= totalElements*3)
		{
			// Bind the array buffer to the VBO
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);

			// Convert the vertex data 32 bit floating values and send it to the array buffer
			// We are using 'gl.STATIC_DRAW' because the vertices are stationary, not part of a moving object
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

			// Draws the triangles to the canvas
			gl.drawArrays(gl.TRIANGLES, 0, vertices.length/totalElements);
		}
	};
	
	// Generates vertices for any polygon
	self.createPolygon = function (origin, sides, radius, color, constrainToAxes)
	{
		// Makes sure that you cannot draw outside the axes
		// Points are scaled to fit within the current axes
		if (constrainToAxes)
		{
			origin[0] *= axisWidth;
			origin[1] *= axisWidth;
		}
		
		// Calculate the angle to rotate by for each new triangle
		var centralAngle = 2*Math.PI/sides;

		var s = 0;
		while (s < sides)
		{
			// Stores the current triangular fragment of the polygon before it is added to the vertices
			var currentTriangle = [];
			
			// Generates 3 vertices for a single triangle
			// The central point
			currentTriangle[0] = [0, 0];
			// Outer point rotated by half the central angle clockwise
			currentTriangle[1] = self.rotateVertice([0, radius], centralAngle/2);
			// Outer point rotated by half the central angle anti-clockwise
			currentTriangle[2] = self.rotateVertice([0, radius], -centralAngle/2);
			
			// Loop through each of the points on this triangle
			var t = 0;
			while (t < 3)
			{
				// Rotate the current triangle around the origin, by a multiple of the central angle
				// This multiple is based on which piece of the polygon this triangle represents
				currentTriangle[t] = self.rotateVertice(currentTriangle[t], centralAngle*s);

				// Translate this triangle so it is at the polygon origin, not the canvas origin
				currentTriangle[t] = self.translateVertice(currentTriangle[t], [origin[0],origin[1]]);

				// Add the colour value to the triangles
				currentTriangle[t] = currentTriangle[t].concat(color);

				// Append the vertices for this triangle to the temporaryVertice so it will be drawn by WebGL
				temporaryVertices = temporaryVertices.concat(currentTriangle[t]);
				
				// Edit the next vertice for this triangle
				t += 1;
			}
			
			// Move onto the next triangular segment of the polgon
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
		
		// Gets the color of the graph background from the css variable and converts it from hex to rbg
		var axisColorObject = self.hexToRgb(document.body.style.getPropertyValue("--theme-color-text-background"));
		var axisColor = [axisColorObject.r/255, axisColorObject.g/255, axisColorObject.b/255, 255/255];
		
		// X axis made of two thin right-angled triangles
		vertices = vertices.concat([-axisWidth,  axisThickness]).concat(axisColor);
		vertices = vertices.concat([-axisWidth, -axisThickness]).concat(axisColor);
		vertices = vertices.concat([ axisWidth,  axisThickness]).concat(axisColor);
		
		vertices = vertices.concat([ axisWidth,  axisThickness]).concat(axisColor);
		vertices = vertices.concat([ axisWidth, -axisThickness]).concat(axisColor);
		vertices = vertices.concat([-axisWidth, -axisThickness]).concat(axisColor);
		
		// Y axis made of two thin right-angled triangles
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
		// Use the custom shader program defined above
		gl.useProgram(program);
		
		// Gets the color of the graph background from the css variable and converts it from hex to rbg
		var rgbBackground = self.hexToRgb(document.body.style.getPropertyValue("--theme-color-page-background-light"));
		
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