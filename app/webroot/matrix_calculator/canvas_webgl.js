// Converts canvas values (pixels) to clipspace values (-1 to 1)
function canvasYToClipspace(y) {
	var navbarHeight = pxToFloat(window.getComputedStyle(navbar).height);
	var canvasDivPadding = pxToFloat(window.getComputedStyle(canvasDiv).padding);
	
	return (canvas.height - y + canvasDivPadding + navbarHeight)/canvas.height*2 - 1;
}

function canvasXToClipspace(x) {
	var navbarHeight = pxToFloat(window.getComputedStyle(navbar).height);
	var canvasDivPadding = pxToFloat(window.getComputedStyle(canvasDiv).padding);
	
	return (x - canvasDivPadding)/canvas.height*2 - 1;
}


// Handles mouse events
function mouseDown(event) {
	mouseDownX = event.clientX;
	mouseDownY = event.clientY;
	mouseDown = true;
}

function mouseUp(event) {
	mouseX = canvasXToClipspace(event.clientX);
	mouseY = canvasYToClipspace(event.clientY);
	mouseDown = false;
	createPolygon([mouseX, mouseY], 10, 0.04, [255/255, 0/255, 0/255, 255/255], false);
}

function mouseMove(event) {
	mouseX = canvasXToClipspace(event.clientX);
	mouseY = canvasYToClipspace(event.clientY);
}

// Create a new shader of the specified type
function createShader(type, source) {
	var shader = gl.createShader(type);
	
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader failed to compile", gl.getShaderInfoLog(shader));
		return false;
	}
	
	return shader;
}

// Create a program using a vertex and fragment shader
function createProgram(vertexShader, fragmentShader) {
	var program = gl.createProgram();
	
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	
	gl.linkProgram(program);
	
	return program;
}

// Prepare the attributes in the program to be interfaced by the rest of the program
function prepareAttributes() {
	positionElements = 2; // 2 position elements per vertice (x, y)
	colorElements = 4; // 4 color elements per vertice (red, green, blue, alpha)
	totalElements = positionElements + colorElements; // The total number of elements per vertice (in this case 2 + 4)
	
	positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	gl.vertexAttribPointer(positionAttributeLocation, positionElements, gl.FLOAT, gl.FALSE, totalElements * Float32Array.BYTES_PER_ELEMENT, 0);
	
	colorAttributeLocation = gl.getAttribLocation(program, "a_vert_color");
	gl.vertexAttribPointer(colorAttributeLocation, colorElements, gl.FLOAT, gl.FALSE, totalElements * Float32Array.BYTES_PER_ELEMENT, positionElements * Float32Array.BYTES_PER_ELEMENT);
	
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.enableVertexAttribArray(colorAttributeLocation);
}

// Rotates a 2D point about 0,0 by the specified angle
function rotateVertice(vertice, angle) {
	var rotatedVertice = [];
	rotatedVertice[0] = (vertice[0]) * Math.cos(angle) - (vertice[1]) * Math.sin(angle);
	rotatedVertice[1] = (vertice[0]) * Math.sin(angle) + (vertice[1]) * Math.cos(angle);
	return rotatedVertice;
}

// Translates a 2D point by a certain amount horizontally and vertically
function translateVertice(vertice, translation) {
	vertice[0] += translation[0];
	vertice[1] += translation[1];
	return vertice;
}

// Keeps drawing triangles until we run out of vertices
function drawTriangles(vertices) {
	if (vertices.length >= totalElements*3) {
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length/totalElements);
	}
}

// Generates vertices for any polygon
function createPolygon(origin, sides, radius, color, constrainToAxes) {
	// Makes sure that you cannot draw outside the axes
	if (constrainToAxes) {
		origin[0] *= axisWidth;
		origin[1] *= axisWidth;
	}
	
	var centralAngle = 2*Math.PI/sides;
	
	var s = 0;
	while (s < sides) {
		// Stores the current triangular fragment of the polygon before it is added to the vertices
		var currentTriangle = [];

		currentTriangle[0] = [0, 0];
		currentTriangle[1] = rotateVertice([0, radius], centralAngle/2);
		currentTriangle[2] = rotateVertice([0, radius], -centralAngle/2);

		var t = 0;
		while (t < 3) {
			currentTriangle[t] = rotateVertice(currentTriangle[t], centralAngle*s);
			currentTriangle[t] = translateVertice(currentTriangle[t], [origin[0],origin[1]]);
			currentTriangle[t] = currentTriangle[t].concat(color);
			vertices = vertices.concat(currentTriangle[t]);
			t += 1
		}
		s += 1
	}
}

// Declares all the static vertices that will be drawn
function declareStaticVertices() {
	vertices = [];

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
}

// Render loop called every frame update
function render() {
	gl.useProgram(program);
	
	// Clears the screen and temporary buffers
	gl.clearColor(255/255, 255/255, 255/255, 255/255);

	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// Draws the vertices declared in main
	drawTriangles(vertices);
	
	// Render the next frame
	requestAnimationFrame(render);
}