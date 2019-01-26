// Declare namespace
calculator_solve = function ()
{
	var self = {};
	
	// Gets the unit that should be used for angles (degrees or radians)
	angleUnit = localStorage.getItem("settingAngleUnit");
	
	// Takes an array, and replaces a specified section of that array with a new array
	var replaceArraySection = function (array, start, end, replacement)
	{
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	};
	
	// Verifies that a string value is in the form of a numeric value
	var verifyNumericValue = function (value)
	{
		// RegEx to find any numeric value, positive or negative, integer or decimal
		var checkNumericValue = new RegExp('[+-]?(\\d)+([.](\\d)+)?');
		
		// Try and find any matches within the value
		var match = checkNumericValue.exec(value);

		// If there is no match, return false
		if (match == null)
		{
			return false;
		}
		
		// If the first match found is not the same as the textbox value, return false
		if (match[0] != value)
		{
			return false;
		}

		// The value is numeric
		return true;
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
				
				if (verifyNumericValue(textBox.value))
				{
					// Convert the string value to an float value and create a new Scalar object using it
					var value = parseFloat(textBox.value);
					
					// Create a Scalar item from the textbox value
					equation[i] = calculator_items.Scalar(value);
				}
				else
				{
					return false;
				}
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

						if (verifyNumericValue(textBox.value))
						{
							// Convert the string value to an float value and create a new Scalar object using it
							var value = parseFloat(textBox.value);
						}
						else
						{
							return false;
						}
						
						// Create a Scalar item from the textbox value
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
				// Maps operation abbreviations to their full names
				var operationValueDict =
				{
					"+":"Add",
					"-":"Subtract",
					"X":"Multiply",
					"/":"Divide",
					"^":"Exponential",
					"Dot":"Dot Product",
					"Cross":"Cross Product",
					"P":"Permutations",
					"C":"Combinations",
					"!":"Factorial",
					"Sin":"Sin",
					"Cos":"Cos",
					"Tan":"Tan",
					"Asin":"Arcsin",
					"Acos":"Arccos",
					"Atan":"Arctan",
					"Log":"Log",
					"Ln":"Ln",
					"Tra":"Transpose",
					"Det":"Determinant",
					"Min":"Minor",
					"Mins":"Minors",
					"Cof":"Cofactors",
					"Adj":"Adjugate",
					"Inv":"Inverse",
					"Angl":"Vector Vector Angle",
					"Mag":"Magnitude",
					"Norm":"Normal Vector"
				};
				
				// Get the full operation name from its abbreviation
				var operationValue = operationValueDict[item.getAttribute("value")];
				
				// Unknown operation referenced
				if (operationValue == undefined)
				{
					return false;
				}
				
				var variadicFunction = false;
				
				// Normal vector is the only variadic function
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
				
				// Bracket type has not been chosen
				if (bracketValue == null)
				{
					return false;
				}
				
				equation[i] = calculator_items.Bracket(bracketValue);
			}

			i += 1;
		}

		return equation;
	};

	// Copies all values from an object so it can be passed by-value instead of by-reference
	self.deepClone = function (object)
	{
		return Object.assign({}, object);
	};
	
	// Makes a new array, deep cloning all the objects in the original array
	self.deepCloneArray = function (array)
	{
		if (array == false)
		{
			return false;
		}
		
		var newArray = [];
		
		var i = 0;
		while (i < array.length)
		{
			newArray.push(self.deepClone(array[i]));
			i += 1;
		}
		
		return newArray;
	};

	// Creates a single operation, used when evaluating an equation
	self.createOperation = function (name, operationFunction)
	{
		var operation = {};
		
		operation.name = name;
		operation.operationFunction = operationFunction;
		
		return operation;
	};
	
	// Creates a group of operations with the same general structure, that are evaluated in the same pass through
	self.createOperationGroup = function (direction, numberOfOperandsBefore, numberOfOperandsAfter, operations)
	{
		var operationGroup = {};
		
		operationGroup.direction = direction;
		
		operationGroup.numberOfOperandsBefore = numberOfOperandsBefore;
		operationGroup.numberOfOperandsAfter = numberOfOperandsAfter;
		
		operationGroup.operations = operations;
		
		return operationGroup;
	};
	
	// Solves the inner contents of all brackets
	self.solveBrackets = function (equation)
	{
		var equation = self.deepCloneArray(equation);

		// Counter and location of brackets
		var unclosedBrackets = 0;
		var openBracketLocation = -1;

		// Continues recursion inside brackets if necessary
		var position = 0;
		while (position < equation.length)
		{			
			if (equation[position].value == "(")
			{
				if (unclosedBrackets == 0)
				{
					openBracketLocation = position;
				}

				unclosedBrackets += 1;
			}
			else if (equation[position].value == ")")
			{
				// If bracket closed where there was no open bracket
				if (openBracketLocation == -1)
				{
					return false;
				}
				else if (unclosedBrackets == 1)
				{
					var bracketSolution = self.solveEquation(equation.slice(openBracketLocation + 1, position));
					
					// If solving brackets was not possible
					if (bracketSolution == false)
					{
						return false;
					}

					equation = replaceArraySection(equation, openBracketLocation, position, bracketSolution);

					// Go back to the location just before the start of where the brackets where before
					position = openBracketLocation - 1;
					openBracketLocation = -1;
				}

				unclosedBrackets -= 1;
			}

			position += 1;
		}
		
		// If there are still unclosed brackets left
		if (unclosedBrackets != 0)
		{
			return false;
		}
				
		return equation;
	};
	
	// Solves all operations with an unknown amount of parameters at runtime (variadic functions)
	self.solveVariadicFunctions = function (equation)
	{
		var equation = self.deepCloneArray(equation);
		
		var variadicFunctionOperations = [];
		variadicFunctionOperations.push(
			self.createOperation("Normal Vector", calculator_operations.normalVector)
		);

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

					var solution = false;

					var o = 0;
					while (o < variadicFunctionOperations.length)
					{
						var operation = variadicFunctionOperations[o];
						
						if (equation[i].value == operation.name)
						{
							var solution = operation.operationFunction(operands);
						}

						o += 1;
					}

					// The function could not be solved or an unkown variadic function has been referenced
					if (solution == false)
					{
						return false;
					}

					equation = replaceArraySection(equation, i, inputEndIndex, solution);
				}
			}
			
			i += 1;
		}
		
		return equation;
	};
	
	// Solves all operations with a fixed number of parameters
	self.solveOperationGroups = function (equation)
	{
		var equation = self.deepCloneArray(equation);
		
		var operationGroups = [];
		
		operationGroups.push(
			self.createOperationGroup(
				"left to right",
				0,
				1,
				[
					self.createOperation("Sin", calculator_operations.sin),
					self.createOperation("Cos", calculator_operations.cos),
					self.createOperation("Tan", calculator_operations.tan),
					self.createOperation("Arcsin", calculator_operations.arcsin),
					self.createOperation("Arccos", calculator_operations.arccos),
					self.createOperation("Arctan", calculator_operations.arctan),
					self.createOperation("Ln", calculator_operations.ln),
					self.createOperation("Transpose", calculator_operations.transpose),
					self.createOperation("Determinant", calculator_operations.determinant),
					self.createOperation("Minors", calculator_operations.minors),
					self.createOperation("Cofactors", calculator_operations.cofactors),
					self.createOperation("Adjugate", calculator_operations.adjugate),
					self.createOperation("Inverse", calculator_operations.inverse),
					self.createOperation("Magnitude", calculator_operations.magnitude)
				]
			)
		);
		
		operationGroups.push(
			self.createOperationGroup(
				"left to right",
				0,
				2,
				[
					self.createOperation("Log", calculator_operations.log)
				]
			)
		);
			
		operationGroups.push(
			self.createOperationGroup(
				"left to right",
				0,
				3,
				[
					self.createOperation("Minor", calculator_operations.minor)
				]
			)
		);
		
		operationGroups.push(
			self.createOperationGroup(
				"right to left",
				1,
				0,
				[
					self.createOperation("Factorial", calculator_operations.factorial)
				]
			)
		);
		
		operationGroups.push(
			self.createOperationGroup(
				"left to right",
				1,
				1,
				[
					self.createOperation("Permutations", calculator_operations.permutations),
					self.createOperation("Combinations", calculator_operations.combinations),
					self.createOperation("Dot Product", calculator_operations.dotProduct),
					self.createOperation("Cross Product", calculator_operations.crossProduct),
					self.createOperation("Vector Vector Angle", calculator_operations.vectorVectorAngle)
				]
			)
		);
		
		operationGroups.push(
			self.createOperationGroup(
				"right to left",
				1,
				1,
				[
					self.createOperation("Exponential", calculator_operations.exponential)
				]
			)
		);
		
		operationGroups.push(
			self.createOperationGroup(
				"left to right",
				1,
				1,
				[
					self.createOperation("Divide", calculator_operations.divide),
					self.createOperation("Multiply", calculator_operations.multiply)
				]
			)
		);
		
		operationGroups.push(
			self.createOperationGroup(
				"left to right",
				1,
				1,
				[
					self.createOperation("Add", calculator_operations.add),
					self.createOperation("Subtract", calculator_operations.subtract)
				]
			)
		);
		
		var group = 0;
		while (group < operationGroups.length)
		{
			var operationGroup = operationGroups[group];
			
			if (operationGroup.direction == "left to right")
			{
				var position = operationGroup.numberOfOperandsBefore;
				
				while (position < equation.length - operationGroup.numberOfOperandsAfter)
				{
					var equationSolved = self.solveOperationGroup(equation, position, operationGroup);
					
					// false, a solution could not be found
					if (equationSolved == false)
					{
						return false;
					}
					// array, a solution was found
					else if (Array.isArray(equationSolved))
					{
						equation = equationSolved;
					}
					// Null, none of the operations matched
					else
					{
						position += 1;
					}
				}
			}
			else
			{
				var position = equation.length - operationGroup.numberOfOperandsAfter;
				
				while (position > operationGroup.numberOfOperandsBefore)
				{
					position -= 1;
					
					var operationSolution = self.solveOperationGroup(equation, position, operationGroup);
					
					if (operationSolution == false)
					{
						return false;
					}
					else if (Array.isArray(operationSolution))
					{
						equation = operationSolution;
					}
				}
			}
			
			group += 1;
		}
		
		return equation;
	};
	
	// Solves an individual group of fixed parameter operations
	self.solveOperationGroup = function (equation, position, operationGroup)
	{
		var equation = self.deepCloneArray(equation);
		
		var o = 0;
		while (o < operationGroup.operations.length)
		{
			var operation = operationGroup.operations[o];
			
			if (equation[position].value == operation.name)
			{
				var operandsStartPosition = position - operationGroup.numberOfOperandsBefore;
				var operandsEndPosition = position + operationGroup.numberOfOperandsAfter;
				
				var operandsBefore = equation.slice(operandsStartPosition, position);
				var operandsAfter = equation.slice(position+1, operandsEndPosition+1);
				
				var operands = [];
				operands = operands.concat(operandsBefore);
				operands = operands.concat(operandsAfter);
				
				var solution = operation.operationFunction(operands);
				if (solution == false)
				{
					return false;
				}
				else
				{
					equation = replaceArraySection(equation, operandsStartPosition, operandsEndPosition, solution);
					
					return equation;
				}
			}
			
			o += 1;
		}
		
		return null;
	};
	
	// Solves the list of operations/operands passed in and returns the answer
	self.solveEquation = function (equation)
	{
		equation = self.solveBrackets(equation);
		equation = self.solveVariadicFunctions(equation);
		equation = self.solveOperationGroups(equation);
		
		return equation;
	};
	
	// Performs the required steps to solve the equation inputted by the user, and display it to the page
	self.evaluateItems = function ()
	{
		// Attempts to parse the equation inputted by the user
		var equation = self.parseItemValues();
		
		// Equation is empty
		if (typeof(equation) == "object" && equation.length == 0)
		{
			calculator_display.displaySolutionBelowGraph(false, "Empty equation");
			calculator_display.displayGridsOnGraph(equation);
			return false;
		}
		// Equation could not be parsed due to errors in formatting e.g. missing number
		else if (equation == false)
		{
			calculator_display.displaySolutionBelowGraph(false, "Parse failed");
			calculator_display.displayGridsOnGraph(equation);
			return false;
		}
		
		// Attempts to solve the parsed equation
		var solution = self.solveEquation(equation);
		
		// Check if the solution is false, or if it does not solve to a single item
		// If so, show an error and do not continue
		if (solution == false || solution.length > 1)
		{
			calculator_display.displaySolutionBelowGraph(false, "Solve failed");
			calculator_display.displayGridsOnGraph(equation);
			return false;
		}
		
		// Get the final solution from the array as a single object
		var finalSolution = solution[0];
		
		// Displays the final solution underneath the graph
		calculator_display.displaySolutionBelowGraph(finalSolution);
		
		// Displays grids from the equation, as well as the solution on the graph
		calculator_display.displayGridsOnGraph(equation, finalSolution);
	};
	
	return self;
}();