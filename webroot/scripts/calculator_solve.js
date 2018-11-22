// Declare namespace
calculator_solve = function ()
{
	var self = {};
	
	var angleUnit = localStorage.getItem("settingAngleUnit");
	
	// Takes an array, and replaces a specified section of that array with a new array
	var replaceArraySection = function (array, start, end, replacement)
	{
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	};
	
	// Returns an array containing objects for each item in the equation
	self.parseItemValues = function ()
	{
		var itemDiv = document.getElementById("itemDiv");
		// Returns a new array object for storing scalar, matrix, function and operator objects
		// Cannot use a fixed size array because each item uses a different amount of memory space and js does not support them natively
		var equation = new Array(scalarCount + matrixCount + functionCount + operatorCount);

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
				equation[i] = calculator_items.Scalar(parseFloat(textBox.value));
			}

			// Parse matrix item
			else if (item.className == "matrix")
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
						values[r].push(calculator_items.Scalar(parseFloat(textBoxes[r * 7 + c].value)));
						c += 1;
					}

					r += 1;
				}

				// Creates a new Grid item from the values
				equation[i] = calculator_items.Grid(values);
			}

			// Parse function item
			else if (item.className == "function")
			{
				var functionValue = item.getAttribute("value");

				if (functionValue == "Tra")
				{
					equation[i] = calculator_items.Function("Transpose");
				}
				else if (functionValue == "Det")
				{
					equation[i] = calculator_items.Function("Determinant");
				}
				else if (functionValue == "Sin")
				{
					equation[i] = calculator_items.Function("Sin");
				}
				else if (functionValue == "Cos")
				{
					equation[i] = calculator_items.Function("Cos");
				}
				else if (functionValue == "Tan")
				{
					equation[i] = calculator_items.Function("Tan");
				}
				else
				{
					return false;
				}
			}

			// Parse operator item
			else if (item.className == "operator")
			{
				var operatorValue = item.getAttribute("value");

				if (operatorValue == "+")
				{
					equation[i] = calculator_items.Operator("Add");
				}
				else if (operatorValue == "-")
				{
					equation[i] = calculator_items.Operator("Subtract");
				}
				else if (operatorValue == "*")
				{
					equation[i] = calculator_items.Operator("Multiply");
				}
				else if (operatorValue == "/")
				{
					equation[i] = calculator_items.Operator("Divide");
				}
				else if (operatorValue == "^")
				{
					equation[i] = calculator_items.Operator("Exponential");
				}
				else if (operatorValue == "Â·")
				{
					equation[i] = calculator_items.Operator("DotProduct");
				}
				else if (operatorValue == "x")
				{
					equation[i] = calculator_items.Operator("CrossProduct");
				}
				else if (operatorValue == "(")
				{
					equation[i] = calculator_items.Operator("OpenBracket");
				}
				else if (operatorValue == ")")
				{
					equation[i] = calculator_items.Operator("CloseBracket");
				}
				else
				{
					return false;
				}
			}

			i += 1;
		}

		console.log(calculator_solve.solveEquation(equation));
		//return equation;
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
				if (openBracketLocation == -1)
				{
					console.log("ERR: Bracket closed where there was no open bracket");
					return false;
				}

				unclosedBrackets -= 1;
				if (unclosedBrackets == 0)
				{
					var bracketSolution = calculator_solve.solveEquation(equation.slice(openBracketLocation + 1, i));
					if (bracketSolution == false)
					{
						console.log("ERR: Solving brackets was not possible");
						return false;
					}

					equation = replaceArraySection(equation, openBracketLocation, i, bracketSolution);

					// Go back to the location just before the start of where the brackets where before
					i = openBracketLocation - 2;
					openBracketLocation = -1;
				}
			}

			i += 1;
		}

		// FUNCTIONS WITH A SINGLE PARAMETER
		var i = 0;
		while (i < equation.length - 1)
		{
			if (equation[i].type == "Function")
			{
				if (equation[i].parameterCount == 1)
				{
					inputEndIndex = i+1;
					
					if (equation[i].value == "Ln")
					{
						var solution = calculator_operations.ln(equation[i+1]);
					}
					else if (equation[i].value == "Sin")
					{
						var solution = calculator_operations.sin(equation[i+1]);
					}
					else if (equation[i].value == "Cos")
					{
						var solution = calculator_operations.cos(equation[i+1]);
					}
					else if (equation[i].value == "Tan")
					{
						var solution = calculator_operations.tan(equation[i+1]);
					}
					else if (equation[i].value == "Arcsin")
					{
						var solution = calculator_operations.arcsin(equation[i+1]);
					}
					else if (equation[i].value == "Arccos")
					{
						var solution = calculator_operations.arccos(equation[i+1]);
					}
					else if (equation[i].value == "Arctan")
					{
						var solution = calculator_operations.arctan(equation[i+1]);
					}
					else if (equation[i].value == "Vector Magnitude")
					{
						var solution = calculator_operations.arctan(equation[i+1]);
					}
					else
					{
						// Unknown single parameter function listed
						return false;
					}
				}
				else
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
							// Save where the close operation bracket is so that solveEquation knows what part of the equation to replaec with the solution
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
					
					// If the function brackets were not closed, return false
					if (bracketClosed == false)
					{
						return false;
					}
					
					// If the amount of parameters entered does not match the amount the function takes, return false
					// Unless the amount of paramters required is 0 (which means that it can take any amount of parameters)
					if (operands.length != equation[i].parameterCount && equation[i].parameterCount != 0)
					{
						return false;
					}
					
					if (equation[i].value == "Normal Vector")
					{
						var solution = calculator_operations.normalVector(operands);
					}
					else if (equation[i].value == "Vector Vector Angle")
					{
						var solution = calculator_operations.vectorVectorAngle.apply(this, operands);
					}
					else if (equation[i].value == "Minor")
					{
						var solution = calculator_operations.minor.apply(this, operands);
					}
					else if (equation[i].value == "Log")
					{
						var solution = calculator_operations.log.apply(this, operands);
					}
					else if (equation[i].value == "Permutations")
					{
						var solution = calculator_operations.permutations.apply(this, operands);
					}
					else if (equation[i].value == "Combinations")
					{
						var solution = calculator_operations.combinations.apply(this, operands);
					}
					else
					{
						// Function brackets were used when there is no function
						return false;
					}
				}
				
				if (solution == false)
				{
					return false;
				}
				
				equation = replaceArraySection(equation, i, inputEndIndex, solution);
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
				else
				{
					equation = replaceArraySection(equation, i - 1, i + 1, solution);
				}
			}
			else
			{
				i += 1;
			}
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
				else
				{
					equation = replaceArraySection(equation, i - 1, i + 1, solution);
				}
			}
			else
			{
				i += 1;
			}
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
				else
				{
					equation = replaceArraySection(equation, i - 1, i + 1, solution);
				}
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
			else
			{
				i += 1;
			}

			if (solved == true) {
				if (solution == false)
				{
					return false;
				}

				equation = replaceArraySection(equation, i - 1, i + 1, solution);
			}
		}

		// ADDITION AND SUBTRACTION
		var i = 1;
		while (i < equation.length - 1)
		{
			var solved = false;

			if (equation[i].value == "Add")
			{
				var solution = calculator_operations.add(equation[i - 1], equation[i + 1]);
				solved = true;
			}
			else if (equation[i].value == "Subtract")
			{
				var solution = calculator_operations.subtract(equation[i - 1], equation[i + 1]);
				solved = true;
			}
			else
			{
				i += 1;
			}
			
			if (solved == true) {
				if (solution == false)
				{
					return false;
				}
				
				equation = replaceArraySection(equation, i - 1, i + 1, solution);
			}
		}

		return equation;
	};
	
	self.solve = function ()
	{
		var scalarA = calculator_items.Scalar(0);
		var scalarB = calculator_items.Scalar(0);
		var scalarC = calculator_items.Scalar(3);
		var scalarD = calculator_items.Scalar(9);
		
		var vectorA = calculator_items.Grid([[calculator_items.Scalar(3)],[calculator_items.Scalar(5)],[calculator_items.Scalar(1)]]);
		var vectorB = calculator_items.Grid([[calculator_items.Scalar(7)],[calculator_items.Scalar(1)],[calculator_items.Scalar(3)]]);
		var vectorC = calculator_items.Grid([[calculator_items.Scalar(5)],[calculator_items.Scalar(2)],[calculator_items.Scalar(0)]]);
		
		var matrixA = calculator_items.Grid([[calculator_items.Scalar(1),calculator_items.Scalar(2)],[calculator_items.Scalar(3),calculator_items.Scalar(4)]]);
		
		var add = calculator_items.Operator("Add");
		var exponential = calculator_items.Operator("Exponential");
		var dot = calculator_items.Operator("Dot Product");
		var cross = calculator_items.Operator("Cross Product");
		var determinant = calculator_items.Operator("Determinant");
		var minor = calculator_items.Function("Minor", 3);
		var normal = calculator_items.Function("Normal Vector", 0);
		var sin = calculator_items.Function("Sin", 1);
		var log = calculator_items.Function("Log", 2);
		var magnitude = calculator_items.Function("Magnitude", 2);
		var angle = calculator_items.Function("Vector Vector Angle", 2);

		var openOperationBracket = calculator_items.Bracket("[");
		var closeOperationBracket = calculator_items.Bracket("]");
		
		//var equation = [minor, openOperationBracket, matrixA, scalarA, scalarB, closeOperationBracket, add, log, openOperationBracket, scalarD, scalarC, closeOperationBracket];
		//var equation = [angle, openOperationBracket, vectorA, vectorB, closeOperationBracket];
		
		//var equation = [scalarC, add, matrixA];
		//console.log(calculator_solve.solveEquation(equation));
	}
	
	return self;
}();