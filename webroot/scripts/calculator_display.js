// Declare namespace
calculator_display = function ()
{
	var self = {};
	
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
		// Scalar, bracket and operation item
		if (item.type == "Scalar" || item.type == "Bracket" || item.type == "Operation")
		{
			return item.value;
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
		if (solution == false)
		{
			// Display a red error message instead of a solution
			solutionWrapperText.style.color = "red";
			solutionWrapperText.innerHTML = errorMessage;
		}
		// Otherwise 
		else
		{
			// Generate the latex for the solution, and add this to the solution wrapper div
			var tex = "$" + self.itemToLatex(solution) + "$";
			solutionWrapperText.innerHTML = tex;
			solutionWrapperText.style.color = "var(--theme-color-text)";
		}
		
		// Re-render the MathJax on the page to show the solution
		MathJax.Hub.Typeset(solutionWrapper);
		
		return solutionWrapper;
	};
	
	self.displayGridsOnGraph = function (equation, solution)
	{
		// Clears the canvas of all previously drawn points
		temporaryVertices = [];
		
		// Clones the solution object so that when the referenceItem is changed for the solution, the original items stay immutable.
		solution = Object.assign({}, solution);
		
		// If a solution has been provided, attempt to display it
		if (solution != undefined)
		{
			// Add the solution to the list of items in the equation, if the solution is a grid
			if (solution.type == "Matrix" || solution.type == "Vector")
			{
				solution.itemReference = solutionWrapper;
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
					var grid = [];
					
					// A JS reference to the item/solution that the grid was created from
					var itemReference = equation[i].itemReference;
					grid.push(itemReference);
					
					// Only draw the points if the pointsVisible attribute is true (toggled by clicking on the colorIndicator)
					if (grid[0].getAttribute("pointsVisible") == "true")
					{
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
							grid.push([x,y]);
							
							c += 1;
						}	
					}
					
					// Add this set of points to the grid array
					grids.push(grid);
				}
			}
			
			i += 1;
		}
		
		// Round maximums up to the nearest integer
		xMax = Math.ceil(xMax);
		yMax = Math.ceil(yMax);
		
		// Change axis maximums that are 0 to 1, as points on 0 length axes are not drawn at all.
		if (xMax == 0)
		{
			xMax = 1;
		}
		if (yMax == 0)
		{
			yMax = 1;
		}
	
		// If grids were parsed, add axes labels
		if (grids.length != 0)
		{
			xMinLabel.innerHTML = -xMax;
			xMinHalfLabel.innerHTML = -xMax/2;
			xMaxLabel.innerHTML = xMax;
			xMaxHalfLabel.innerHTML = xMax/2;
			yMinLabel.innerHTML = -yMax;
			yMinHalfLabel.innerHTML = -yMax/2;
			yMaxLabel.innerHTML = yMax;
			yMaxHalfLabel.innerHTML = yMax/2;
		}
		else
		{	
			// If the equation was not parsed correctly, we must clear all the old colorIndicator colors
			var allColorIndicators = document.getElementsByClassName("colorIndicator");
			
			var i = 0;
			while (i < allColorIndicators.length)
			{
				allColorIndicators[i].style.backgroundColor = "";
				i += 1;
			}
		}
		
		// If there were no axis limits set, all the points must be hidden so do not display any axis labels
		if (isNaN(xMax) || isNaN(yMax))
		{
			xMinLabel.innerHTML = "";
			xMinHalfLabel.innerHTML = "";
			xMaxLabel.innerHTML = "";
			xMaxHalfLabel.innerHTML = "";
			yMinLabel.innerHTML = "";
			yMinHalfLabel.innerHTML = "";
			yMaxLabel.innerHTML = "";
			yMaxHalfLabel.innerHTML = "";
		};
		
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
			
			// Gets the grid info
			var grid = grids[g];
			
			var colorIndicator = grid[0].getElementsByClassName("colorIndicator")[0];
			colorIndicator.style.backgroundColor = "rgba("+red+","+green+","+blue+")";
			
			var i = 1;
			while (i < grid.length)
			{
				// Takes the x and y values, and converts them so that they are between -1 and 1
				var xRelative = axisWidth * grid[i][0] / (xMax);
				var yRelative = axisWidth * grid[i][1] / (yMax);
				calculator_canvas.createPolygon([xRelative, yRelative], 10, 0.03, [red/255, green/255, blue/255, 255/255], false);
				
				i += 1;
			}
			
			g += 1;
		}
	};
	
	return self;
}();