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
				equation[i] = calculator_items.Scalar(parseFloat(textBox.value));
			}

			// Parse matrix and vector items
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
						values[r].push(calculator_items.Scalar(parseFloat(textBoxes[r * 7 + c].value)));
						c += 1;
					}

					r += 1;
				}

				// Creates a new Grid item from the values
				equation[i] = calculator_items.Grid(values);
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
					"Asin":"Arcin",
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
					else
					{
						// An unknown variadic function has been referenced
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
	
	self.solve = function ()
	{
		var vectorA = calculator_items.Grid([[calculator_items.Scalar(3)],[calculator_items.Scalar(5)],[calculator_items.Scalar(1)]]);
		var vectorB = calculator_items.Grid([[calculator_items.Scalar(7)],[calculator_items.Scalar(1)],[calculator_items.Scalar(3)]]);
		var vectorC = calculator_items.Grid([[calculator_items.Scalar(5)],[calculator_items.Scalar(2)],[calculator_items.Scalar(0)]]);
		
		var matrixA = calculator_items.Grid([[calculator_items.Scalar(1),calculator_items.Scalar(2)],[calculator_items.Scalar(3),calculator_items.Scalar(4)]]);
		var matrixB = calculator_items.Grid([[calculator_items.Scalar(2),calculator_items.Scalar(2),calculator_items.Scalar(3)],[calculator_items.Scalar(4),calculator_items.Scalar(5),calculator_items.Scalar(6)],[calculator_items.Scalar(7),calculator_items.Scalar(8),calculator_items.Scalar(9)]]);
	}
	
	return self;
}();