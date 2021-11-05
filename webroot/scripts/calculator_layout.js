// Declare namespace
calculator_layout = function()
{
	var self = {};
	
	// Creates a main wrapper div for all elements
	self.createMainDiv = function ()
	{
		var mainDiv = document.createElement("div");
		mainDiv.id = "mainDiv";
		mainDiv.style.padding = 0;
		document.body.appendChild(mainDiv);
		
		var calculatorLayout = localStorage.getItem("themeCalculatorLayout");
		if (calculatorLayout == "Equation before solution")
		{
			// Create the equation div before the canvas div
			self.createEquationDiv();
			self.createSolutionDiv();
		}
		else
		{
			// Create the graph div before the equation div
			self.createSolutionDiv();
			self.createEquationDiv();
		}
	};
	
	// Create a new div to wrap a html5 canvas with a WebGL context
	self.createSolutionDiv = function ()
	{
		var mainDiv = document.getElementById("mainDiv");
		
		var solutionDiv = document.createElement("div");
		solutionDiv.id = "solutionDiv";
		solutionDiv.style.padding = "30px";
		solutionDiv.style.display = "block";
		solutionDiv.style.float = "var(--theme-solution-div-float)";
		mainDiv.appendChild(solutionDiv);
		
		var canvasWrapper = document.createElement("div");
		canvasWrapper.id = "canvasWrapper";
		canvasWrapper.position = "relative";
		solutionDiv.appendChild(canvasWrapper);
		
		var canvas = document.createElement("canvas");
		canvas.id = "canvas";
		canvas.style.position = "absolute";
		canvas.style.boxShadow = "var(--theme-box-shadow)";
		canvas.style.borderRadius = "var(--theme-border-radius)";
		canvasWrapper.appendChild(canvas);
		
		var canvasLabels = document.createElement("div");
		canvasLabels.id = "canvasLabels";
		// Allows the user to click underneath the labels div so they can click on the canvas
		canvasLabels.style.pointerEvents = "none";
		canvasLabels.style.position = "absolute";
		
		// Draw the axis labels
		xMinLabel = document.createElement("div");
		xMinLabel.id = "xMinLabel";
		xMinLabel.style.position = "absolute";
		xMinLabel.style.top = "52%";
		xMinLabel.style.left = "5%";
		
		xMinHalfLabel = document.createElement("div");
		xMinHalfLabel.id = "xMinHalfLabel";
		xMinHalfLabel.style.position = "absolute";
		xMinHalfLabel.style.top = "52%";
		xMinHalfLabel.style.left = "25%";
		
		xMaxLabel = document.createElement("div");
		xMaxLabel.id = "xMaxLabel";
		xMaxLabel.style.position = "absolute";
		xMaxLabel.style.top = "52%";
		xMaxLabel.style.right = "5%";
		
		xMaxHalfLabel = document.createElement("div");
		xMaxHalfLabel.id = "xMaxHalfLabel";
		xMaxHalfLabel.style.position = "absolute";
		xMaxHalfLabel.style.top = "52%";
		xMaxHalfLabel.style.right = "25%";
		
		yMinLabel = document.createElement("div");
		yMinLabel.id = "yMinLabel";
		yMinLabel.style.position = "absolute";
		yMinLabel.style.bottom = "5%";
		yMinLabel.style.right = "52%";
		
		yMinHalfLabel = document.createElement("div");
		yMinHalfLabel.id = "yMinHalfLabel";
		yMinHalfLabel.style.position = "absolute";
		yMinHalfLabel.style.bottom = "25%";
		yMinHalfLabel.style.right = "52%";
		
		yMaxLabel = document.createElement("div");
		yMaxLabel.id = "yMaxLabel";
		yMaxLabel.style.position = "absolute";
		yMaxLabel.style.top = "5%";
		yMaxLabel.style.right = "52%";
		
		yMaxHalfLabel = document.createElement("div");
		yMaxHalfLabel.id = "yMaxHalfLabel";
		yMaxHalfLabel.style.position = "absolute";
		yMaxHalfLabel.style.top = "25%";
		yMaxHalfLabel.style.right = "52%";
		
		// Add them to the canvas
		canvasLabels.appendChild(xMinLabel);
		canvasLabels.appendChild(xMinHalfLabel);
		canvasLabels.appendChild(xMaxLabel);
		canvasLabels.appendChild(xMaxHalfLabel);
		canvasLabels.appendChild(yMinLabel);
		canvasLabels.appendChild(yMinHalfLabel);
		canvasLabels.appendChild(yMaxLabel);
		canvasLabels.appendChild(yMaxHalfLabel);
		
		canvasWrapper.appendChild(canvasLabels);
		
		var solutionWrapper = calculator_build.createEmptyBox();
		solutionWrapper.id = "solutionWrapper";
		solutionWrapper.setAttribute("pointsVisible", "true");
		solutionWrapper.style.position = "relative";
		solutionWrapper.style.marginTop = "4vh";
		solutionWrapper.style.display = "flex";
		solutionWrapper.style.justifyContent = "center";
		solutionWrapper.style.alignItems = "center";
		
		var solutionWrapperText = document.createElement("div");
		solutionWrapperText.id = "solutionWrapperText";
		solutionWrapperText.innerHTML = "Enter an equation to solve it";
		solutionWrapper.appendChild(solutionWrapperText);
		
		var colorIndicator = calculator_build.createColorIndicator();
		colorIndicator.style.position = "absolute";
		colorIndicator.style.width = "9%";
		colorIndicator.style.height = "12%";
		colorIndicator.style.right = "0px";
		colorIndicator.style.bottom = "0px";
		solutionWrapper.appendChild(colorIndicator);
		
		solutionDiv.appendChild(solutionWrapper);
		
		gl = canvas.getContext("webgl",{preserveDrawingBuffer:true});
	};
	
	// Create new div to hold the current matrix equation and the buttons used for editing the equation
	self.createEquationDiv = function ()
	{
		var mainDiv = document.getElementById("mainDiv");
		
		// Creates a div for holding all elements for building the equation
		var equationDiv = document.createElement("div");
		equationDiv.id = "equationDiv";
		equationDiv.style.padding = "30px";
		equationDiv.style.float = "var(--theme-equation-div-float)";
		mainDiv.appendChild(equationDiv);
		
		// Creates all buttons for adding new items to the equation
		var addItemButtons = [];
		addItemButtons.push(layout.createButton("Scalar", calculator_build.addScalar, "var(--theme-color-main)", "var(--theme-color-main-light)"));
		addItemButtons.push(layout.createButton("Grid", calculator_build.addGrid, "var(--theme-color-main)", "var(--theme-color-main-light)"));
		addItemButtons.push(layout.createButton("Operation", calculator_build.addOperation, "var(--theme-color-main)", "var(--theme-color-main-light)"));
		addItemButtons.push(layout.createButton("Bracket", calculator_build.addBracket, "var(--theme-color-main)", "var(--theme-color-main-light)"));

		// Creates a row of the add item buttons
		var equationAddItemButtonDiv = layout.createButtonRow(addItemButtons);
		equationAddItemButtonDiv.id = "equationAddItemButtonDiv";
		equationDiv.appendChild(equationAddItemButtonDiv);
		
		// Creates a container div for all items e.g. scalars, matrices, vectors,  operations and brackets
		var itemDiv = document.createElement("div");
		itemDiv.id = "itemDiv";
		equationDiv.appendChild(itemDiv);
		
		// Create buttons for importing/exporting the equation to a file
		var finishItemButtons = [];
			
		// Deletes every item in the equation
		var clearButtonClick = function () {
			// Reset all the item counts
			calculator_build.resetItemCounts();
			
			// Hide the clear/export buttons below the equation
			calculator_build.toggleEquationFinishButtons();
			
			setTimeout(function ()
			{
				// Clear the item div of all items
				itemDiv.innerHTML = "";
				
				// Re-evaluate the equation to clear the solution wrapper and graph
				calculator_solve.evaluateItems();
			},200);
		};
		
		var clearButton = layout.createButton("Clear", clearButtonClick, "var(--theme-color-main)", "var(--theme-color-main-light)");
		
		// Exports the equation and solution to a latex file
		// This can be viewed in the users latex rendered of choice
		var exportButtonClick = function ()
		{
			var latex = "";
			latex += "\\[";
			
			// Parses the equation inputted by the user
			var equation = calculator_solve.parseItemValues();
			
			if (typeof(equation) == "object" && equation.length == 0)
			{
				latex += "Empty \\space Equation \\]";
			}
			else if (equation == false)
			{
				latex += "Parse \\space Failed \\]";
			}
			else
			{
				// Only export the equation if it is not blank
				if (equation.length > 0)
				{
					// Convert each item to latex and add it to the string
					var i = 0;
					while (i < equation.length)
					{
						var item = equation[i];
						
						// Add the item to the string after it has been converted to latex
						latex += calculator_display.itemToLatex(item);
						latex += " \\space ";
						
						i += 1;
					};
					

				}
				
				latex += "=\n";
				
				// Solves the parsed equation
				var solution = calculator_solve.solveEquation(equation);
				
				if (solution == false || typeof(solution) == "number")
				{
					latex += "Solve \\space Failed";
				}
				else if (solution.length > 1)
				{
					latex += "No \\space Single \\space Solution";
				}
				else
				{
					var finalSolution = solution[0];
					latex += calculator_display.itemToLatex(finalSolution);
				}
				
				latex += "\\]";
			}
			
			var canvasImageURL = canvas.toDataURL();
			
			// Construct a HTML page to display the equation using MathJax
			var page = "";
			page += "<html>\n<head>\n";
			
			// Add MathJax scripts
			page += "<script type='text/x-mathjax-config'>MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});</script>\n";
			page += "<script type='text/javascript' async src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML'></script>\n";
			page += "</head>\n<body>\n<span>\n";
			
			// Add LaTeX typesetting
			page += latex;
			page += "<br>";
			
			// Add canvas image
			page += "<img style='display: block; margin: 0 auto;' src='" + canvasImageURL + "'></image>";
			
			page += "\n<\span>\n</body>\n</html>";
			
			// Provide a link for the file to the users browser that will auto-download
			var blob = new Blob([page], { type: 'text/plain' });
			
			// Create the download link element
			var fileAnchor = document.createElement("a");
			fileAnchor.download = "equation.html";
			fileAnchor.href = (window.URL).createObjectURL(blob);
			fileAnchor.dataset.downloadurl = ['text/plain', fileAnchor.download, fileAnchor.href].join(':');
			
			// Begin the download
			fileAnchor.click();
		};
		
		var exportButton = layout.createButton("Export", exportButtonClick, "var(--theme-color-main)", "var(--theme-color-main-light)");
		
		finishItemButtons.push(clearButton);
		finishItemButtons.push(exportButton);
		
		// Create the finishButtonDiv
		var equationFinishButtonDiv = layout.createButtonRow(finishItemButtons);
		equationFinishButtonDiv.id = "equationFinishButtonDiv";
		equationFinishButtonDiv.style.visibility = "hidden";
		equationFinishButtonDiv.style.animationDuration = "0.25s";
		equationDiv.appendChild(equationFinishButtonDiv);
	};
	
	// Makes the canvas a square shape that fits perfectly within the viewport
	// Then fit the equation div into the remaining space, either beside or below the canvas
	self.resizePage = function ()
	{
		// Gets computed properties. Must use window.getComputedStyle because element.clientHeight rounds to integer values
		// The +2 is necessary because the "montserrat" font takes a small time to load, but is 2 pixels taller than the default font
		var navbarHeight = layout.pxToFloat(window.getComputedStyle(navbar).height) + 2;
		var solutionDivPadding = layout.pxToFloat(window.getComputedStyle(solutionDiv).padding);
		var equationDivPadding = layout.pxToFloat(window.getComputedStyle(equationDiv).padding);
		
		// Page taller than wide (portrait orientation)
		if (document.body.offsetHeight - navbarHeight > document.body.offsetWidth)
		{
			canvas.width = document.body.offsetWidth - 2 * solutionDivPadding;
			canvas.height = canvas.width;
		}
		// Page wider than tall (landscape orientation)
		else
		{
			canvas.height = document.body.offsetHeight - 2 * solutionDivPadding - navbarHeight;
			canvas.width = canvas.height;
		}
		
		canvasWrapper.style.width = canvas.width;
		canvasWrapper.style.height = canvas.height
		canvasLabels.style.width = canvas.width;
		canvasLabels.style.height = canvas.height;
			
		// Size the viewport according to the canvas size
		gl.viewport(0, 0, canvas.width, canvas.height);

		// Check whether equationDiv should beside canvasDiv, or underneath canvasDiv
		// If the canvas (and its padding) is taking more than 60% of the horizontal screen space...
		if (canvas.width + 2 * solutionDivPadding > 0.6 * document.body.offsetWidth)
		{
			// Position them one on top of the other
			// Make equation div fill all available horizontal space
			equationDiv.style.width = document.body.offsetWidth - 2 * equationDivPadding;
			// Makes sure that the canvas is centered horizontally using margins
			solutionDiv.style.marginLeft = (document.body.offsetWidth - canvas.width - 2 * solutionDivPadding) / 2;
			solutionDiv.style.marginRight = solutionDiv.style.marginLeft;
		}
		else
		{
			// ...otherwise position them side by side
			// Make equation div fit into remaining horizontal space
			// Must take 17 pixels to account for a scrollbar
			equationDiv.style.width = document.body.offsetWidth - canvas.width - 2 * solutionDivPadding - 2 * equationDivPadding - 17;
			// Removes horizontal centering margins
			solutionDiv.style.margin = "0px";
		}
	};
	
	return self;
}();