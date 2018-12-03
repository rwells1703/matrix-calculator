// Declare namespace
calculator_solve = function ()
{
	var self = {};
	
	angleUnit = localStorage.getItem("settingAngleUnit");
	
	// Takes an array, and replaces a specified section of that array with a new array
	var replaceArraySection = function (array, start, end, replacement)
	{
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	};
	
	// Returns an array containing objects for each item in the equation
	self.parseItemValues = function ()
	{
		var itemDiv = document.getElementById("itemDiv");
		// Returns a new array object for storing scalar, matrix, vector and operation objects
		// Cannot use a fixed size array because each item uses a different amount of memory space and js does not support them natively
		var equation = new Array(scalarCount + gridCount + operationCount + bracketCount);

		var i = 0;
		while (i < itemDiv.children.length)
		{
			var item = itemDiv.children[i];

			// Parse scalar item
			if (item.className == "scalar")
			{
				// Take the value from the text box
				var textBox = item.getElementsByTagName("input")[0];
				
				// Convert the string value to an float value and create a new Scalar object using it
				var value = parseFloat(textBox.value);
				if (typeof(value) != "number" || isNaN(value))
				{
					return false;
				}
				
				equation[i] = calculator_items.Scalar(value);
			}

			// Parse grid (matrix or vector) items
			else if (item.className == "grid") 
			{	
				// Take the value from the text box
				var textBoxes = item.getElementsByTagName("input");
				
				var rows = item.getAttribute("rows");
				var columns = item.getAttribute("columns");
				
				var values = [];

				var r = 0;
				while (r < rows)
				{
					// Add new row
					values.push([]);

					var c = 0;
					while (c < columns)
					{
						// Adds a new floating point value to the row
						var textBox = textBoxes[r * (calculator_build.gridMaxRows-1) + c];

						var value = parseFloat(textBox.value);
						if (typeof(value) != "number" || isNaN(value))
						{
							return false;
						}
						
						values[r].push(calculator_items.Scalar(value));
						
						c += 1;
					}

					r += 1;
				}

				// Creates a new Grid item from the values
				equation[i] = calculator_items.Grid(values, item);
			}
			
			// Parse operation items
			else if (item.className == "operation")
			{
				var operationValueDict =
				{
					"+":"Add",
					"-":"Subtract",
					"*":"Multiply",
					"/":"Divide",
					"^":"Exponential",
					"·":"Dot Product",
					"x":"Cross Product",
					"p":"Permutations",
					"c":"Combinations",
					"!":"Factorial",
					"Sin":"Sin",
					"Cos":"Cos",
					"Tan":"Tan",
					"Asin":"Arcsin",
					"Acos":"Arccos",
					"Atan":"Arctan",
					"Log":"Log",
					"Ln":"Ln",
					"T":"Transpose",
					"Det":"Determinant",
					"Min":"Minor",
					"Mins":"Minors",
					"Cof":"Cofactors",
					"Adj":"Adjugate",
					"Inv":"Inverse",
					"Angle":"Vector Vector Angle",
					"Mag":"Magnitude",
					"Norm":"Normal Vector"
				};
				
				var operationValue = operationValueDict[item.getAttribute("value")];
				
				// Unknown operation referenced
				if (operationValue == undefined)
				{
					return false;
				}
				
				var variadicFunction = false;
				if (operationValue == "Normal Vector")
				{
					variadicFunction = true;
				}
				
				equation[i] = calculator_items.Operation(operationValue, variadicFunction);
			}
			
			// Parse bracket items
			else if (item.className == "bracket")
			{
				var bracketValue = item.getAttribute("value");
				
				equation[i] = calculator_items.Bracket(bracketValue);
			}

			i += 1;
		}

		return equation;
	};
	
	self.verifyBounds = function (operationPos, lower, upper, equationLength)
	{
		if (lower < 0 || upper > equationLength - 1)
		{
			return operationPos;
		}
		
		return true;
	};
	
	// Solves the mathematical equation passed in, and returns the answer
	self.solveEquation = function (equation)
	{
		// BRACKETS
		// Counter and location of brackets
		var unclosedBrackets = 0;
		var openBracketLocation = -1;

		// Continues recursion inside brackets if necessary
		var i = 0;
		while (i < equation.length)
		{
			if (equation[i].value == "(")
			{
				if (unclosedBrackets == 0)
				{
					openBracketLocation = i;
				}

				unclosedBrackets += 1;
			}
			else if (equation[i].value == ")")
			{
				// If bracket closed where there was no open bracket
				if (openBracketLocation == -1)
				{
					return false;
				}

				unclosedBrackets -= 1;
				if (unclosedBrackets == 0)
				{
					var bracketSolution = calculator_solve.solveEquation(equation.slice(openBracketLocation + 1, i));
					
					// If solving brackets was not possible
					if (bracketSolution == false)
					{
						return false;
					}

					equation = replaceArraySection(equation, openBracketLocation, i, bracketSolution);

					// Go back to the location just before the start of where the brackets where before
					i = openBracketLocation - 1;
					openBracketLocation = -1;
				}
			}

			i += 1;
		}

		// OPERATIONS THAT ACCEPT ANY NUMBER OF PARAMETERS (VARIADIC FUNCTIONS)
		var i = 0;
		while (i < equation.length - 3)
		{
			if (equation[i].type == "Operation")
			{
				if (equation[i].variadicFunction == true)
				{
					// If the item after the operation name is not an open operation bracket, return false
					if (equation[i+1].value != "[")
					{
						return false;
					}
					
					// Empty array to hold all the operands of the operation
					var operands = [];
					
					// Used to keep track of where the operands of this operation end
					var bracketClosed = false;
					var inputEndIndex = 0;
					
					// Start on the item after the open operation bracket
					var j = i + 2;
					while (j < equation.length && bracketClosed == false)
					{
						if (equation[j].value == "]")
						{
							// Save where the close operation bracket is so that solveEquation knows what part of the equation to replace with the solution
							bracketClosed = true;
							inputEndIndex = j;
						}
						else
						{
							// Otherwise add the operand to the list of operands
							operands.push(equation[j]);
						}
						
						j += 1;
					}
					
					// If the variadic brackets were not closed, return false
					if (bracketClosed == false)
					{
						return false;
					}
					
					var solved = false;

					if (equation[i].value == "Normal Vector")
					{
						var solution = calculator_operations.normalVector(operands);
						solved = true;
					}
					// If an unknown variadic function has been referenced
					else
					{
						return false;
					}

					if (solved == true)
					{
						if (solution == false)
						{
							return false;
						}

						equation = replaceArraySection(equation, i, inputEndIndex, solution);
					}
				}
			}
			
			i += 1;
		}
		
		// LN, COS, SIN, TAN, ARCCOS, ARCSIN, ARCTAN, DETERMINANT, TRANSPOSE, MINORS, COFACTORS, ADJUGATE, INVERSE, MAGNITUDE
		var i = 0;
		while (i < equation.length - 1)
		{
			var solved = false;
			if (equation[i].value == "Ln")
			{
				var solution = calculator_operations.ln(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Sin")
			{
				var solution = calculator_operations.sin(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Cos")
			{
				var solution = calculator_operations.cos(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Tan")
			{
				var solution = calculator_operations.tan(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Arcsin")
			{
				var solution = calculator_operations.arcsin(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Arccos")
			{
				var solution = calculator_operations.arccos(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Arctan")
			{
				var solution = calculator_operations.arctan(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Determinant")
			{
				var solution = calculator_operations.determinant(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Transpose")
			{
				var solution = calculator_operations.transpose(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Minors")
			{
				var solution = calculator_operations.minors(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Cofactors")
			{
				var solution = calculator_operations.cofactors(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Adjugate")
			{
				var solution = calculator_operations.adjugate(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Inverse")
			{
				var solution = calculator_operations.inverse(equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Magnitude")
			{
				var solution = calculator_operations.magnitude(equation[i + 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i, i + 1, solution);
			}

			i += 1;
		}

		// LOG
		var i = 0;
		while (i < equation.length - 2)
		{
			var solved = false;
			if (equation[i].value == "Log")
			{
				var solution = calculator_operations.log(equation[i + 1], equation[i + 2]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i, i + 2, solution);
			}

			i += 1;
		}
		
		// FACTORIAL
		var i = 1;
		while (i < equation.length)
		{
			var solved = false;
			if (equation[i].value == "Factorial")
			{
				var solution = calculator_operations.factorial(equation[i - 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i, solution);

				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}

			i += 1;
		}

		// PERMUTATIONS AND COMBINATIONS
		var i = 1;
		while (i < equation.length - 1)
		{
			var solved = false;
			if (equation[i].value == "Permutations")
			{
				var solution = calculator_operations.permutations(equation[i - 1], equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Combinations")
			{
				var solution = calculator_operations.combinations(equation[i - 1], equation[i + 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);

				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}

			i += 1;
		}
		
		// CROSS PRODUCT
		var i = 1;
		while (i < equation.length - 1)
		{
			var solved = false;
			if (equation[i].value == "Cross Product")
			{
				var solution = calculator_operations.crossProduct(equation[i - 1], equation[i + 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);

				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}

			i += 1;
		}

		// DOT PRODUCT
		var i = 1;
		while (i < equation.length - 1)
		{
			var solved = false;
			if (equation[i].value == "Dot Product")
			{
				var solution = calculator_operations.dotProduct(equation[i - 1], equation[i + 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);

				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}

			i += 1;
		}

		// VECTOR VECTOR ANGLE
		var i = 1;
		while (i < equation.length - 1)
		{
			var solved = false;
			if (equation[i].value == "Vector Vector Angle")
			{
				var solution = calculator_operations.vectorVectorAngle(equation[i - 1], equation[i + 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);

				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}

			i += 1;
		}
		
		// EXPONENTIALS
		var i = equation.length - 2;
		while (i > 0)
		{
			var solved = false;

			if (equation[i].value == "Exponential")
			{
				var solution = calculator_operations.exponential(equation[i - 1], equation[i + 1]);
				solved = true;
			}
			
			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);
			}
			
			i -= 1;
		}

		// DIVISION AND MULTIPLICATION
		var i = 1;
		while (i < equation.length - 1)
		{	
			var solved = false;

			if (equation[i].value == "Divide")
			{
				var solution = calculator_operations.divide(equation[i - 1], equation[i + 1]);
				solved = true;
				
			}
			else if (equation[i].value == "Multiply")
			{
				var solution = calculator_operations.multiply(equation[i - 1], equation[i + 1]);
				solved = true;
			}

			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);

				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}
			
			i += 1;
		}

		// ADDITION AND SUBTRACTION
		//var i = 1;
		//while (i < equation.length - 1)
		var i = 0;
		while (i < equation.length)
		{
			var solved = false;
			var boundCheck = self.verifyBounds(i, i-1, i+1, equation.length);
			
			if (equation[i].value == "Add")
			{
				if (typeof(boundCheck) == "number")
				{
					return boundCheck;
				}
				var solution = calculator_operations.add(equation[i - 1], equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Subtract")
			{
				if (typeof(boundCheck) == "number")
				{
					return boundCheck;
				}
				var solution = calculator_operations.subtract(equation[i - 1], equation[i + 1]);
				solved = true;
			}
			
			if (solved == true)
			{
				if (solution == false)
				{
					return false;
				}
				
				equation = replaceArraySection(equation, i - 1, i + 1, solution);
				
				// Move back one place in the equation to get to position where the evalulated statement used to begin
				i -= 1;
			}

			i += 1;
		}

		return equation;
	};
	
	// Converts a Scalar item into a latex string
	self.scalarToLatex = function (scalar)
	{
		return scalar.value;
	};
	
	// Converts a Grid item into a latex string
	self.gridToLatex = function (grid)
	{
		var tex = "\\begin{bmatrix}";
		
		// Loop though each row and column of the grid
		var r = 0;
		while (r < grid.rows)
		{
			var c = 0;
			while (c < grid.columns)
			{
				// Convert the grid element to LaTeX and add it to final LaTeX string.
				tex += self.itemToLatex(grid.value[r][c]);
				
				// Add an & between elements, except the last element of each column
				if (c != grid.columns - 1)
				{
					tex += "&";
				}
				
				c += 1;
			}
			
			// Move onto a new line
			tex += "\\\\";
			
			r += 1;
		}
		
		tex += "\\end{bmatrix}";
		
		return tex;
	};
	
	// Converts any item into a latex string
	self.itemToLatex = function (item)
	{
		// Scalar item
		if (item.type == "Scalar")
		{
			return self.scalarToLatex(item);
		}
		// Grid items
		else if (item.type == "Matrix" || item.type == "Vector")
		{
			return self.gridToLatex(item);
		}
		
		return false;
	};
	
	// Displays the solution to the screen by adding an item underneath the canvas
	self.displaySolutionBelowGraph = function (solution, errorMessage)
	{
		// If a previous solution is being displayed, remove it before displaying the new solution
		var oldSolutionWrapper = document.getElementById("solution");
		if (oldSolutionWrapper != null)
		{
			oldSolutionWrapper.parentNode.removeChild(oldSolutionWrapper);
		}

		// Create a new empty box to hold the solution
		var solutionWrapper = calculator_build.createEmptyBox();
		solutionWrapper.id = "solution";
		solutionWrapper.style.marginTop = "4vh";
		solutionWrapper.style.display = "flex";
		solutionWrapper.style.justifyContent = "center";
		solutionWrapper.style.alignItems = "center";
		
		if (solution == false)
		{
			// Display a red error message instead of a solution
			solutionWrapper.style.color = "red";
			solutionWrapper.innerHTML = errorMessage;
		}
		// Otherwise 
		else
		{
			// Generate the latex for the solution, and add this to the solution wrapper div
			var tex = "$" + self.itemToLatex(solution) + "$";
			solutionWrapper.innerHTML = tex;
		}
		
		// Append the solution wrapper to the canvas div
		//var canvasDiv = document.getElementById("canvasDiv");
		solutionDiv.appendChild(solutionWrapper);
		
		// Re-render the MathJax on the page to show the solution
		MathJax.Hub.Typeset(solutionWrapper);
		
		return solutionWrapper;
	};
	
	self.displayGridsOnGraph = function (equation, solution, solutionItem)
	{
		// Clears the canvas of all previously drawn points
		temporaryVertices = [];
		
		// If a solution has been provided, attempt to display it
		if (solution != undefined)
		{
			// Add the solution to the list of items in the equation, if the solution is a grid
			if (solution.type == "Matrix" || solution.type == "Vector")
			{
				solution.itemReference = solutionItem;
				equation.push(solution);
			}
		}
		
		var xMax;
		var yMax;
		
		var grids = [];

		var i = 0;
		while (i < equation.length)
		{
			if (equation[i].type == "Matrix" || equation[i].type == "Vector")
			{	
				if (equation[i].rows == 2)
				{
					var info = [];
					var c = 0;
					while (c < equation[i].columns)
					{
						// Plots the point to the canvas
						var x = equation[i].value[0][c].value;
						var y = equation[i].value[1][c].value;
						
						if (Math.abs(x) > xMax || xMax == undefined)
						{
							xMax = Math.abs(x);
						}
						
						if (Math.abs(y) > yMax || yMax == undefined)
						{
							yMax = Math.abs(y);
						}

						// Add this pair of points to the points array
						info.push([x,y]);
						
						// A JS reference to the item/solution that the grid was created from
						var itemReference = equation[i].itemReference;
						info.push(itemReference);
						
						c += 1;
					}
					
					// Add this set of points to the grid array
					grids.push(info);
				}
			}
			
			i += 1;
		}
		
		// Round maximums up to the nearest integer
		xMax = Math.ceil(xMax);
		yMax = Math.ceil(yMax);
		
		// Clear old axis labels
		var i = 0;
		var noOfChildren = canvasLabels.children.length;
		while (i < noOfChildren)
		{
			canvasLabels.removeChild(canvasLabels.children[0]);
			i += 1;
		}
		
		// If there are grids being drawn to the graph, add axes labels
		if (grids.length != 0)
		{
			// Draw new axis labels
			xMinLabel = document.createElement("div");
			xMinLabel.style.position = "absolute";
			xMinLabel.style.top = "52%";
			xMinLabel.style.left = "5%";
			xMinLabel.innerHTML = -xMax;
			
			xMinHalfLabel = document.createElement("div");
			xMinHalfLabel.style.position = "absolute";
			xMinHalfLabel.style.top = "52%";
			xMinHalfLabel.style.left = "25%";
			xMinHalfLabel.innerHTML = -xMax/2;
			
			xMaxLabel = document.createElement("div");
			xMaxLabel.style.position = "absolute";
			xMaxLabel.style.top = "52%";
			xMaxLabel.style.right = "5%";
			xMaxLabel.innerHTML = xMax;
			
			xMaxHalfLabel = document.createElement("div");
			xMaxHalfLabel.style.position = "absolute";
			xMaxHalfLabel.style.top = "52%";
			xMaxHalfLabel.style.right = "25%";
			xMaxHalfLabel.innerHTML = xMax/2;
			
			yMinLabel = document.createElement("div");
			yMinLabel.style.position = "absolute";
			yMinLabel.style.bottom = "5%";
			yMinLabel.style.right = "52%";
			yMinLabel.innerHTML = -yMax;
			
			yMinHalfLabel = document.createElement("div");
			yMinHalfLabel.style.position = "absolute";
			yMinHalfLabel.style.bottom = "25%";
			yMinHalfLabel.style.right = "52%";
			yMinHalfLabel.innerHTML = -yMax/2;
			
			yMaxLabel = document.createElement("div");
			yMaxLabel.style.position = "absolute";
			yMaxLabel.style.top = "5%";
			yMaxLabel.style.right = "52%";
			yMaxLabel.innerHTML = yMax;
			
			yMaxHalfLabel = document.createElement("div");
			yMaxHalfLabel.style.position = "absolute";
			yMaxHalfLabel.style.top = "25%";
			yMaxHalfLabel.style.right = "52%";
			yMaxHalfLabel.innerHTML = yMax/2;
			
			// Add them to the canvas
			canvasLabels.appendChild(xMinLabel);
			canvasLabels.appendChild(xMinHalfLabel);
			canvasLabels.appendChild(xMaxLabel);
			canvasLabels.appendChild(xMaxHalfLabel);
			canvasLabels.appendChild(yMinLabel);
			canvasLabels.appendChild(yMinHalfLabel);
			canvasLabels.appendChild(yMaxLabel);
			canvasLabels.appendChild(yMaxHalfLabel);
		}
		
		var g = 0;
		while (g < grids.length)
		{
			// Generates a seed based on the amount of grids and the location of the current grid within this list
			var seed = (g * 2 * Math.PI) / grids.length;
			
			// Generates red, green and blue values using sinusoidal waves so that all sets of points are different colors
			var red = 255 * Math.sin(seed);
			if (red < 0)
			{
				red = 0;
			}
			var green = 255 * Math.sin(seed + (Math.PI / 2));
			if (green < 0)
			{
				green = 0;
			}
			var blue = 255 * Math.sin(seed + Math.PI);
			if (blue < 0)
			{
				blue = 0;
			}
			
			// Gets the points
			var points = grids[g];
			
			var p = 0;
			while (p < points.length)
			{
				// Takes the x and y values, and converts them so that they are between -1 and 1
				var xRelative = axisWidth * points[p][0] / (xMax);
				var yRelative = axisWidth * points[p][1] / (yMax);
				calculator_canvas.createPolygon([xRelative, yRelative], 10, 0.03, [red/255, green/255, blue/255, 255/255], false);
				
				p += 1;
			}
			
			g += 1;
		}
	};
	
	// Performs the required steps to solve the equation inputted by the user, and display it to the page
	self.evaluateItems = function ()
	{
		console.log("evaluateItems");
		
		// Parses the equation inputted by the user
		var equation = self.parseItemValues();
		console.log(equation);
		
		if (typeof(equation) == "object" && equation.length == 0)
		{
			self.displaySolutionBelowGraph(false, "Empty equation");
			self.displayGridsOnGraph(equation);
			return false;
		}
		else if (equation == false)
		{
			self.displaySolutionBelowGraph(false, "Parse failed");
			self.displayGridsOnGraph(equation);
			return false;
		}
		
		// Solves the parsed equation
		var solution = self.solveEquation(equation);
		
		// Check if the solution is false, or if it is a reference to the position of an operation the causing error
		if (solution == false || typeof(solution) == "number")
		{
			self.displaySolutionBelowGraph(false, "Solve failed");
			self.displayGridsOnGraph(equation);
			return false;
		}
		// If it does not solve to a single item, do not show this as a solution
		else if (solution.length > 1)
		{
			self.displaySolutionBelowGraph(false, "No single solution");
			self.displayGridsOnGraph(equation);
			return false;
		}
		
		var finalSolution = solution[0];
		
		// Displays the final solution underneath the graph
		var solutionItem = self.displaySolutionBelowGraph(finalSolution);
		
		// Displays grids from the equation, as well as the solution on the graph
		self.displayGridsOnGraph(equation, finalSolution, solutionItem);
	};
	
	return self;
}();