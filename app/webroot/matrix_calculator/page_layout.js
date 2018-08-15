// Converts a string value "px" on the end, to a float value
function pxToFloat(string) {
	return parseFloat(string.substring(0, string.length-2));
}

// Creates a new top row button e.g. add scalar
function createButton(innerHTML, onclick) {
	var button = document.createElement("div");
	button.style.display = "table";
	button.style.height = "100%";
	// Keeps gaps between buttons and makes sure each is centered within its grid square
	button.style.width = "70%";
	button.style.margin = "0 auto";
	// Prevents text from being too close to side of button
	button.style.padding = "5%";
	
	// Create a small table cell div that holds the button text so that it can be perfectly central
	var text = document.createElement("div");
	text.innerHTML = innerHTML;
	text.style.display = "table-cell";
	text.style.verticalAlign = "middle";
	text.style.textAlign = "center";
	button.appendChild(text);
	
	button.style.color = "white";
	button.style.backgroundColor = "var(--theme-color-main)";
	button.style.borderRadius = "var(--theme-border-radius)";
	button.style.boxShadow = "var(--theme-box-shadow)";

	button.style.cursor = "pointer";
	button.onclick = onclick;
	
	return button;
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
	equationAddItemButtonDiv = document.createElement("div");
	equationAddItemButtonDiv.id = "equationAddItemButtonDiv";
	equationAddItemButtonDiv.style.marginBottom = "5vh";
	equationAddItemButtonDiv.style.height = "10vh";
	equationAddItemButtonDiv.style.display = "grid";
	equationAddItemButtonDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
	equationDiv.appendChild(equationAddItemButtonDiv);

	// Create all buttons for adding new items
	equationAddItemButtonDiv.appendChild(createButton("Add scalar", addScalar));
	equationAddItemButtonDiv.appendChild(createButton("Add matrix", addMatrix));
	equationAddItemButtonDiv.appendChild(createButton("Add operator", addOperator));
	
	// Create container div for all items e.g. scalars, matrices and operators
	itemDiv = document.createElement("div");
	itemDiv.id = "itemDiv";
	equationDiv.appendChild(itemDiv);
	
	// Create container div for bottom row buttons
	equationFinishButtonDiv = document.createElement("div");
	equationFinishButtonDiv.id = "equationFinishButtonDiv";
	equationFinishButtonDiv.style.height = "10vh";
	equationFinishButtonDiv.style.display = "grid";
	equationFinishButtonDiv.style.gridTemplateColumns = "repeat(2, 1fr)";
	equationFinishButtonDiv.style.visibility = "hidden";
	equationFinishButtonDiv.style.animationDuration = "0.25s";
	equationDiv.appendChild(equationFinishButtonDiv);
	
	// Create all buttons for adding new items
	equationFinishButtonDiv.appendChild(createButton("Solve", solveEquation));
	equationFinishButtonDiv.appendChild(createButton("Export", null));
	
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
	var canvasDivMargin = pxToFloat(window.getComputedStyle(canvasDiv).margin);
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
	if (canvas.width + 2*canvasDivPadding + 2*canvasDivMargin> 0.6*window.innerWidth) {
		// Position them one on top of the other
		equationDiv.style.float = "left";
		// Make equation div fill all available horizontal space
		equationDiv.style.width = window.innerWidth - 2*equationDivPadding - 20;
		// Makes sure that the canvas is centered horizontally using margins
		canvasDiv.style.marginLeft = (window.innerWidth - canvas.width - 2*canvasDivPadding) / 2;
		canvasDiv.style.marginRight = canvasDiv.style.marginLeft;
	// ...otherwise position them side by side
	} else {
		equationDiv.style.float = "right";
		// Make equation div fit into remaining horizontal space
		equationDiv.style.width = window.innerWidth - canvas.width - 2*canvasDivPadding - 2*equationDivPadding - 20;
		// Removes horizontal centering margins
		canvasDiv.style.margin = "0px";
	}
}