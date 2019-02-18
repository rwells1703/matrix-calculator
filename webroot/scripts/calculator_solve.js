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
				
				// Gets the rows and columns DOM attributes
				var rows = item.getAttribute("rows");
				var columns = item.getAttribute("columns");
				
				// Creates an empty array to store the values of the grid
				var values = [];

				// Loop through all rows and columns in the grid
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

						// If the text box value is numeric parse it and store it
						if (verifyNumericValue(textBox.value))
						{
							// Convert the string value to an float value and create a new Scalar object using it
							var value = parseFloat(textBox.value);
						}
						// Non-numeric value in textbox that cannot be parsed
						else
						{
							return false;
						}
						
						// Create a Scalar item from the textbox value
						values[r].push(calculator_items.Scalar(value));
						
						// Next column
						c += 1;
					}

					// Next row
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
				
				// Create a new Operation item
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
				
				// Create a new Bracket item
				equation[i] = calculator_items.Bracket(bracketValue);
			}

			i += 1;
		}

		return equation;
	};

	// Copies all values from an object so it can be passed by-value instead of by-reference
	self.deepClone = function (object)
	{
		// Creates a new object identical, but it does not refence the original object
		// Instead it occupies its own new memory location
		return Object.assign({}, object);
	};
	
	// Makes a new array, deep cloning all the objects in the original array
	self.deepCloneArray = function (array)
	{
		// Return false when a false array is passed in
		// Pretents an array like the following being produced: [false]
		if (array == false)
		{
			return false;
		}
		
		// Create a new array to hold the deepcloned values
		var newArray = [];
		
		// Loop through each value in the input array
		var i = 0;
		while (i < array.length)
		{
			// Deep clone this array element, and append it to the new array
			newArray.push(self.deepClone(array[i]));

			// Continue to the next array item
			i += 1;
		}
		
		return newArray;
	};

	// Creates a single operation, used when evaluating an equation
	self.createOperation = function (name, operationFunction)
	{
		var operation = {};
		
		// The name of the operation as a string
		operation.name = name;
		
		// A reference to the function that handles the logic of the operation
		operation.operationFunction = operationFunction;
		
		return operation;
	};
	
	// Creates a group of operations with the same general structure, that are evaluated in the same pass through
	self.createOperationGroup = function (direction, numberOfOperandsBefore, numberOfOperandsAfter, operations)
	{
		var operationGroup = {};
		
		// Specifies the direction in which these operations should be evaluated
		// Either 'left to right' or 'right to left'
		operationGroup.direction = direction;
		
		// Specifies the amount of operands that should be found both before and after the operation item
		operationGroup.numberOfOperandsBefore = numberOfOperandsBefore;
		operationGroup.numberOfOperandsAfter = numberOfOperandsAfter;
		
		// An array containing the operations contained within the group
		operationGroup.operations = operations;
		
		return operationGroup;
	};
	
	// Solves the inner contents of all brackets
	self.solveBrackets = function (equation)
	{
		// Deep clone the equation so that it is not treated as passed by reference
		var equation = self.deepCloneArray(equation);

		// Counter and location of brackets
		var unclosedBrackets = 0;
		var openBracketLocation = -1;

		// Continues recursion inside brackets if necessary
		var position = 0;
		while (position < equation.length)
		{		
			// If an opening bracket is found	
			if (equation[position].value == "(")
			{
				// If this is the first opening bracket found, otherwise ignore it
				if (unclosedBrackets == 0)
				{
					// Record its position
					openBracketLocation = position;
				}

				// Increment the counter of open brackets
				unclosedBrackets += 1;
			}
			// If a closing bracket is found
			else if (equation[position].value == ")")
			{
				// If bracket closed where there was no open bracket
				if (openBracketLocation == -1)
				{
					return false;
				}
				// If there was an open bracket
				else if (unclosedBrackets == 1)
				{
					// Evaluate the sub-equation inside the brackets and return the solution
					// RECURSIVE, as this will call solveBrackets again on the sub-equation
					var bracketSolution = self.solveEquation(equation.slice(openBracketLocation + 1, position));
					
					// If solving brackets was not possible
					if (bracketSolution == false)
					{
						return false;
					}

					// Replace the brackets and their contents with their solution
					equation = replaceArraySection(equation, openBracketLocation, position, bracketSolution);

					// Go back to the location just before the start of where the brackets where before
					position = openBracketLocation - 1;
					// Clear the location of the most recently opened bracket
					openBracketLocation = -1;
				}

				// Decrement the counter of how many brackets are currently open
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
		// Deep clone the equation so that it is not treated as passed by reference
		var equation = self.deepCloneArray(equation);
		
		// Define all variadic functions the calculator supports
		// Currently only supports 'Normal Vector'
		var variadicFunctionOperations = [];
		variadicFunctionOperations.push(
			self.createOperation('Normal Vector', calculator_operations.normalVector)
		);

		// Loop through every element in the equation looking for variadic functions
		var i = 0;
		while (i < equation.length - 3)
		{
			// Continue if the item is an operation
			if (equation[i].type == "Operation")
			{
				// Continue if the operation is a variadic function
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

					// Begin by assuming the solution is false
					// If none is found it remains false
					var solution = false;

					// Loop through each possible variadic function operation
					var o = 0;
					while (o < variadicFunctionOperations.length)
					{
						// Get the current variadic function to check
						var operation = variadicFunctionOperations[o];
						
						// If the current item in the equation matches the operation being checked, evaluate it
						if (equation[i].value == operation.name)
						{
							// Evaluate the variadic function using its operands
							var solution = operation.operationFunction(operands);
						}

						// Check next variadic operation
						o += 1;
					}

					// The function could not be solved or an unkown variadic function has been referenced
					if (solution == false)
					{
						return false;
					}

					// Replace the current equation state with the newly evaluated equation
					equation = replaceArraySection(equation, i, inputEndIndex, solution);
				}
			}
			
			i += 1;
		}
		
		return equation;
	};
	
	// Array to hold the groups of operations, grouped by equal priority when being evaluated
	// Stored as a private variable inside this module, instead of a public property
	var operationGroups = [];
			
	// Using createOperationGroup function to define all the groups of operations in the following form:
	// (direction of evaluation, operands before, operands before, [array of operation items...])
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

	// Solves all operations with a fixed number of parameters
	self.solveOperationGroups = function (equation)
	{
		// Deep clone the equation so that it is not treated as passed by reference
		var equation = self.deepCloneArray(equation);

		// Loop through all operation groups
		var group = 0;
		while (group < operationGroups.length)
		{
			// The current operation group is 
			var operationGroup = operationGroups[group];
			
			// If this group of operations is evaluated from left to right...
			if (operationGroup.direction == "left to right")
			{
				// Start looking slightly in from the left, based on the amount of operands we expect before the operation
				var position = operationGroup.numberOfOperandsBefore;
				
				// Loop through the equation to the right, stopping just short based on the amount of operands expected after the operation
				while (position < equation.length - operationGroup.numberOfOperandsAfter)
				{
					// Evaluate the equation for the current group of operations
					var equationSolved = self.solveOperationGroup(equation, position, operationGroup);
					
					// Returned false => a solution could not be found
					if (equationSolved == false)
					{
						return false;
					}
					// Returned an array => a solution was found
					else if (Array.isArray(equationSolved))
					{
						// Replace the current equation state with the newly evaluated equation
						equation = equationSolved;
					}
					// Returned null, none of the operations matched
					else
					{
						// Continue to the next position in the equation
						position += 1;
					}
				}
			}
			else
			{
				// Start looking slightly in from the right, based on the amount of operands we expect after the operation
				var position = equation.length - operationGroup.numberOfOperandsAfter;
				
				// Loop through the equation to the left, stopping just short based on the amount of operands expected before operation
				while (position > operationGroup.numberOfOperandsBefore)
				{
					// Move one position left
					position -= 1;
					
					// Evaluate the equation for the current group of operations
					var operationSolution = self.solveOperationGroup(equation, position, operationGroup);
					
					// Returned false => a solution could not be found
					if (operationSolution == false)
					{
						return false;
					}
					// Returned an array => a solution was found
					else if (Array.isArray(operationSolution))
					{
						// Replace the current equation state with the newly evaluated equation
						equation = operationSolution;
					}
				}
			}
			
			// Continue to evaluate the next group in order of priority
			group += 1;
		}
		
		return equation;
	};
	
	// Solves an individual group of fixed parameter operations
	self.solveOperationGroup = function (equation, position, operationGroup)
	{
		// Deep clone the equation so that it is not treated as passed by reference
		var equation = self.deepCloneArray(equation);
		
		// Loop through each operation in the current operation group
		var o = 0;
		while (o < operationGroup.operations.length)
		{
			// Select the current operation
			var operation = operationGroup.operations[o];
			
			// If the operation we are referencing in the equation matches the current operations name
			if (equation[position].value == operation.name)
			{
				// Calculate the positions where the operands for that operation should begin and end
				var operandsStartPosition = position - operationGroup.numberOfOperandsBefore;
				var operandsEndPosition = position + operationGroup.numberOfOperandsAfter;
				
				// Extract a sub-arrays of the operands from the equation array
				var operandsBefore = equation.slice(operandsStartPosition, position);
				var operandsAfter = equation.slice(position+1, operandsEndPosition+1);
				
				// Create a complete array of the operations by concatenating the smaller before/after arrays
				var operands = [];
				operands = operands.concat(operandsBefore);
				operands = operands.concat(operandsAfter);
				
				// Call the operations function on its operands
				var solution = operation.operationFunction(operands);
				// If the solution could not be found, return false
				if (solution == false)
				{
					return false;
				}
				// If the operation was successfully evaluated
				else
				{
					// Replace the operation and all its operands with the solution that was found
					equation = replaceArraySection(equation, operandsStartPosition, operandsEndPosition, solution);
					
					// Return the partly evaluated equation
					return equation;
				}
			}
			
			// Move onto the next operation in the group
			o += 1;
		}
		
		return null;
	};
	
	// Solves the list of operations/operands passed in and returns the answer
	self.solveEquation = function (equation)
	{
		// Evaluates all sets of brackets in the equation
		equation = self.solveBrackets(equation);
		// Evaluates all variadic funcctions in the equation
		equation = self.solveVariadicFunctions(equation);
		// Evaluates remaining operations in the equation
		equation = self.solveOperationGroups(equation);
		
		// Returns the fully evaluated equation
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