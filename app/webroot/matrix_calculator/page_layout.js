// Converts a string value "px" on the end, to a float value
function pxToFloat(string) {
	return parseFloat(string.substring(0, string.length-2));
}

// Creates a main wrapper div for all elements
function createMainDiv() {
	mainDiv = document.createElement("div");
	mainDiv.id = "mainDiv";
	mainDiv.style.padding = 0;
	document.body.appendChild(mainDiv);
}

// Create a new div to wrap a html5 canvas with a WebGL context
function createCanvasDiv() {
	canvasDiv = document.createElement("div");
	canvasDiv.id = "canvasDiv";
	canvasDiv.style.padding = "5vh";
	canvasDiv.style.display = "block";
	canvasDiv.style.float = "left";
	
	mainDiv.appendChild(canvasDiv);
	
	canvas = document.createElement("canvas");
	canvas.style.boxShadow = "var(--theme-box-shadow)";
	canvas.style.borderRadius = "var(--theme-border-radius)";
	canvasDiv.appendChild(canvas);
	
	gl = canvas.getContext("webgl");
}

// Create new div to hold the current matrix equation and the buttons used for editing the equation
function createEquationDiv() {
	equationDiv = document.createElement("div");
	equationDiv.id = "equationDiv";
	equationDiv.style.padding = "5vh";
	mainDiv.appendChild(equationDiv);
	
	// Create container div for top row buttons
	addItemButtonDiv = document.createElement("div");
	addItemButtonDiv.id = "addItemButtonDiv";
	addItemButtonDiv.style.position = "relative";
	addItemButtonDiv.style.marginBottom = "5vh";
	addItemButtonDiv.style.height = "10vh";
	addItemButtonDiv.style.display = "grid";
	addItemButtonDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
	equationDiv.appendChild(addItemButtonDiv);

	// Create all buttons for adding new items
	addTopRowButton("Add scalar", addScalar);
	addTopRowButton("Add matrix", addMatrix);
	addTopRowButton("Add operator", addOperator);
	
	// Create container div for all items e.g. scalars, matrices and operators
	itemDiv = document.createElement("div");
	itemDiv.id = "itemDiv";
	equationDiv.appendChild(itemDiv);
	
	// Counts increase/decrease for every item added/removed from the equation
	matrixCount = 0;
	scalarCount = 0;
	operatorCount = 0;
}

// Makes the canvas a square shape that fits perfectly within the viewport
// Then fit the equation div into the remaining space, either beside or below the canvas
function resizePage() {
	var navbarHeight = pxToFloat(window.getComputedStyle(navbar).height);
	var canvasDivPadding = pxToFloat(window.getComputedStyle(canvasDiv).padding);
	var equationDivPadding = pxToFloat(window.getComputedStyle(equationDiv).padding);
	
	// We use this instead of window.innerHeight because it prevents a bug on mobile
	// It prevents the whole page rearranging when the mobile URL bar hides during scrolling
	// Using the computed style, height gets the height of the window, ignoring the url bar.
	var windowHeight = pxToFloat(window.getComputedStyle(document.body)["height"]);
	
	// Page taller than wide (portrait orientation)
	if (window.innerHeight - navbarHeight > window.innerWidth) {
		canvas.width = window.innerWidth - 2*canvasDivPadding;
		canvas.height = canvas.width;
	}
	// Page wider than tall (landscape orientation)
	else {
		canvas.height = windowHeight - 2*canvasDivPadding - navbarHeight;
		canvas.width = canvas.height;
	}
	
	// Size the viewport according to the canvas size
	gl.viewport(0,0,canvas.width,canvas.height);
	
	// Check whether equationDiv should beside canvasDiv, or underneath canvasDiv
	// If the canvas (and its padding) is taking more than 60% of the horizontal screen space...
	if (canvas.width + 2*canvasDivPadding > 0.6*window.innerWidth) {
		// Position them one on top of the other
		equationDiv.style.float = "left";
		equationDiv.style.width = window.innerWidth - 2*equationDivPadding - 20;
	}
	else {
		// Position them side by side
		equationDiv.style.float = "right";
		equationDiv.style.width = window.innerWidth - canvas.width - 2*canvasDivPadding - 2*equationDivPadding - 20;
	}
}

// Creates a new top row button e.g. add scalar
function addTopRowButton(innerHTML, onclick) {
	var button = document.createElement("div");
	button.style.display = "table";
	button.style.height = "100%";
	
	var text = document.createElement("div");
	text.innerHTML = innerHTML;
	text.style.display = "table-cell";
	text.style.verticalAlign = "middle";
	text.style.textAlign = "center";
	button.appendChild(text);
	
	button.style.width = "80%";
	button.style.margin = "0 auto";
	
	button.style.color = "white";
	button.style.backgroundColor = "var(--theme-color-main)";
	button.style.borderRadius = "var(--theme-border-radius)";
	button.style.boxShadow = "var(--theme-box-shadow)";

	button.style.cursor = "pointer";
	
	button.onclick = onclick;
	
	addItemButtonDiv.appendChild(button);
}