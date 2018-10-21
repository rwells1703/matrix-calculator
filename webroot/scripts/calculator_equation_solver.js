// Declare namespace
calculator_equation_solver = (function(context)
{
	// Takes an array, and replaces a specified section of that array with a new array
	var replaceArraySection = function(array, start, end, replacement)
	{
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	}

	// A wrapper function that holds functions for all the mathematical operations not built into Javascript e.g. dot product
	context.specialOperations = (function(self)
	{
		// Takes two vectors and calculates the dot product between them
		self.dotProduct = function(left, right)
		{
			// Verify that both inputs are vectors
			if (left.type != "Vector" || right.type != "Vector")
			{
				return false
			}

			// Verify that the vectors are of the same dimension
			if (left.rows != right.rows)
			{
				return false
			}

			var total = 0;

			// Loop through each row (dimension) of the vectors
			var r = 0;
			while (r < left.rows)
			{
				// Multiply the vectors together in the same dimension, and add this value to the total
				total += left.value[r][0] * right.value[r][0];
				r += 1;
			}

			return total;
		};

		// Creates a matrix containing all zeros of the specified order
		self.generateZeroMatrix = function(rows, columns)
		{
			var elements = [];

			var r = 0;
			while (r < rows)
			{
				// Adds a new blank row
				elements.push([]);
				
				// Fill the blank row with zeros
				var c = 0;
				while (c < columns)
				{
					elements[r].push(0);
					c += 1;
				}
				
			r += 1;
			}
			
			// Create a new matrix object containing the zero matrix values
			return context.Matrix(elements);
		};
		
		// Creates a square matrix containing a diagonal of 1s from top left to bottom right of the specified order
		self.generateIdentityMatrix = function(size)
		{
			var elements = [];

			var r = 0;
			while (r < size )
			{
				// Adds a new blank row
				elements.push([]);
				
				var c = 0;
				while (c < size)
				{
					if (r == c)
					{
						// If it is on a diagonal, set the value to 1
						elements[r].push(1);
					}
					else
					{
						// Otherwise set the value to 0
						elements[r].push(0);
					}
					
					c += 1;
				}
				
				r += 1;
			}
			
			// Create a new matrix object containing the identity matrix values
			return context.Matrix(elements);
		};

		// Multiplies two matrices and returns the product, as a matrix
		self.matrixMatrixProduct = function(left, right)
		{
			// Verify that both inputs are matrices
			if (left.type != "Matrix" || right.type != "Matrix")
			{
				return false;
			}

			// Check to see if both matrices are conformable
			//E.g. a has n x m order and b has j x k order
			//For them to be conformable, m and j must be the same
			if (left.columns != right.rows)
			{
				return false;
			}

			// Create zero matrix to correct order
			// E.g. a has n x m order and b has j x k order
			// The product, ab will have n x k order
			var product = context.specialOperations.generateZeroMatrix(left.rows, right.columns);
			
			// The matrix multiplication itself
			var left_row = 0;
			while (left_row < left.rows)
			{
				var right_column = 0;
				while (right_column < right.columns)
				{
					// Could have been to left.columns or right.rows
					// Both of these values should be the same if the matrices are conformable
					var shift = 0;
					while (shift < left.columns)
					{
						// Perform the multiplication and place the product in the correct place in the product matrix
						product.value[left_row][right_column] += left.value[left_row][shift] * right.value[shift][right_column];
						shift += 1;
					}
					
					right_column += 1;
				}
				
				left_row += 1;
			}

			return product;
		};

		// Multiplies each element of a matrix by a scalar
		self.scalarMatrixProduct = function(scalar, matrix)
		{
			// Check that the object types are correct
			if (scalar.type != "Scalar" || matrix.type != "Matrix")
			{
				return false;
			}

			// Generate a new zero matrix, the same size as the origial matrix, that will hold the product
			var product = context.specialOperations.generateZeroMatrix(matrix.rows, matrix.columns);
			
			var r = 0;
			while (r < matrix.rows)
			{
				var c = 0;
				while (c < matrix.columns)
				{
					// Multiply the original matrix by the scalar, and place its value in the corresponding spot in the product matrix
					product.value[r][c] = matrix.value[r][c] * scalar.value;
					c += 1;
				}
				
				r += 1;
			}

			return product;
		};

		return self;
	})({});

	// Scalar class, that holds a single numerical value
	context.Scalar = function(value)
	{
		var self = {};

		self.type = "Scalar";
		self.value = value;

		self.display = function()
		{
			console.log(self.value);
		};

		return self;
	};

	// Matrix class that holds a grid of numerical values
	context.Matrix = function(value)
	{
		var self = {};

		self.type = "Matrix";
		self.value = value;
		self.rows = value.length;
		self.columns = value[0].length;
		
		// Check if the matrix is square (number of rows = number of columns) and set the square property accordingly
		if (self.rows == self.columns)
		{
			self.square = true;
		}
		else
		{
			self.square = false;
		}

		// Function to display the matrix to the console
		self.display = function()
		{
			var r = 0;
			while (r < self.rows)
			{
				var c = 0;
				while (c < self.columns)
				{
					console.log(self.value[r][c]);
					c += 1;
				}
				
				r += 1;
			}
		};
		
		// Returns the determinant of the matrix
		self.getDeterminant = function()
		{
			// Must be a square matrix otherwise the determinant is undefined
			if (!self.square)
			{
				return false;
			}
			
			var determinant = 0;
			
			// Recursive base case, we have reached the smallest matrix possible, a 1 x 1
			if (self.rows == 1 && self.columns == 1)
			{
				return self.value[0][0];
			}
			
			// Start out positive and then switch sign on each row change
			var positive = true;
			
			// Use first column (but any column or row will give same result)
			var row = 0;
			while (row < self.rows)
			{
				var minor = self.getMinorMatrix(row,0);
				
				if (positive)
				{
					// Add the minor determinant to the major determinant if we are on a positive row
					determinant += self.value[row][0] * minor.getDeterminant();
					// Switch from positive to negative
					positive = false;
				}
				else
				{
					// Otherwise subtract it
					determinant -= self.value[row][0] * minor.getDeterminant();
					// Switch from negative to positive
					positive = true;
				}
				
				row += 1;
			}
			
			return determinant;
		};
		
		// Returns the minor matrix for a specific element of the matrix  
		self.getMinorMatrix = function(targetRow, targetColumn)
		{
			// Create zero matrix with 1 less row and 1 less column than the matrix object
			var minor = context.specialOperations.generateZeroMatrix(self.rows - 1, self.columns - 1);
			
			var minorRow = 0;
			var minorColumn = 0;
			
			var majorRow = 0;
			while (majorRow < self.rows)
			{
				var majorColumn = 0;
				while (majorColumn < self.columns)
				{
					if (majorColumn != targetColumn && majorRow != targetRow)
					{
						minor.value[minorRow][minorColumn] = self.value[majorRow][majorColumn];
						
						// Taking 1 away from minor.rows and minor.columns is necessary because they start from 1 whereas arrays start from 0
						if (minorRow == minor.rows - 1	&& minorColumn == minor.columns - 1)
						{
							return minor;
						}
						
						// Move down to the next row of the minor
						// Again, take 1 away from minor.columns because it starts from 1 whereas arrays start from 0
						if (minorColumn == minor.columns - 1)
						{
							minorColumn = 0;
							minorRow += 1;
						}
						else
						{
							minorColumn += 1;
						}
					}
					
					majorColumn += 1;
				}
				
				majorRow += 1;
			}
		};
						
		return self;
	};

	context.Vector = function(value) {
		var self = context.Matrix(value);

		self.type = "Vector";

		return self;
	};

	context.Function = function(value) {
		var self = {};

		self.type = "Function";
		self.value = value;

		return self;
	};

	context.Operator = function(value) {
		var self = {};

		self.type = "Operator";
		self.value = value;

		return self;
	};

	// Returns an array containing objects for each item in the equation
	context.parseItemValues = function() {
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
				equation[i] = context.Scalar(parseFloat(textBox.value));
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
						values[r].push(parseFloat(textBoxes[r*7 + c].value));
						c += 1;
					}
					
					r += 1;
				}

				// Creates a new Matrix item from the values
				equation[i] = context.Matrix(values);
			}

			// Parse function item
			else if (item.className == "function")
			{
				var functionValue = item.getAttribute("value");

				if (functionValue == "Tra")
				{
					equation[i] = context.Function("Transpose");
				}
				else if (functionValue == "Det")
				{
					equation[i] =  context.Function("Determinant");
				}
				else if (functionValue == "Sin")
				{
					equation[i] = context.Function("Sin");
				}
				else if (functionValue == "Cos")
				{
					equation[i] = context.Function("Cos");
				}
				else if (functionValue == "Tan")
				{
					equation[i] = context.Function("Tan");
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
					equation[i] = context.Operator("Add");
				}
				else if (operatorValue == "-")
				{
					equation[i] = context.Operator("Subtract");
				}
				else if (operatorValue == "*")
				{
					equation[i] = context.Operator("Multiply");
				}
				else if (operatorValue == "/")
				{
					equation[i] = context.Operator("Divide");
				}
				else if (operatorValue == "^")
				{
					equation[i] = context.Operator("Exponential");
				}
				else if (operatorValue == "Â·")
				{
					equation[i] = context.Operator("DotProduct");
				}
				else if (operatorValue == "x")
				{
					equation[i] = context.Operator("CrossProduct");
				}
				else if (operatorValue == "(")
				{
					equation[i] = context.Operator("OpenBracket");
				}
				else if (operatorValue == ")")
				{
					equation[i] = context.Operator("CloseBracket");
				}
				else {
					return false;
				}
			}

			i += 1;
		}

		console.log(context.solveEquation(equation));
		//return equation;
	}

	// Solves the mathematical equation passed in, and returns the answer
	context.solveEquation = function(equation)
	{
		// BRACKETS
		// Counter and location of brackets
		var unclosedBrackets = 0;
		var openBracketLocation = -1;

		// Continues recursion inside brackets if necessary
		var i = 0;
		while (i < equation.length)
		{
			if (equation[i] == "(")
			{
				if (unclosedBrackets == 0)
				{
					openBracketLocation = i;
				}
				
				unclosedBrackets += 1;
			}
			else if (equation[i] == ")")
			{
				if (openBracketLocation == -1)
				{
					console.log("ERR: Bracket closed where there was no open bracket");
					return false;
				}

				unclosedBrackets -= 1;
				if (unclosedBrackets == 0)
				{
					var bracketSolution = context.solveEquation(equation.slice(openBracketLocation + 1, i));
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

		// EXPONENTIALS
		var i = equation.length - 2;
		while (i > 0)
		{
			if (equation[i].value == "Exponential")
			{
				var value = Math.pow(equation[i-1].value, equation[i+1].value);
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			
			i -= 1;
		}

		// DIVISION AND MULTIPLICATION
		var i = 1;
		while (i < equation.length - 1)
		{
			if (equation[i].value == "Divide")
			{
				var value = equation[i-1].value / equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else if (equation[i].value == "Multiply")
			{
				var value = equation[i-1].value * equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else
			{
				i += 1;
			}
		}

		// ADDITION AND SUBTRACTION
		var i = 1;
		while (i < equation.length - 1)
		{
			if (equation[i].value == "Add")
			{
				var value = equation[i-1].value + equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else if (equation[i].value == "Subtract")
			{
				var value = equation[i-1].value - equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else
			{
				i += 1;
			}
		}

		return equation;
	}
	
	context.solve = function()
	{
		//var equation = [context.Scalar(24), context.Operator("Divide"), context.Scalar(8), context.Operator("Indice"), context.Scalar(2)];
		//var equation = [context.Scalar(2), context.Operator("Multiply"), "(", context.Scalar(3), context.Operator("Add"), context.Scalar(5), ")", context.Operator("Mulitply"), context.Scalar(0.5)];
		//var equation = ["(", context.Scalar(3), context.Operator("Indice"), context.Scalar(2), ")", context.Operator("Indice"), context.Scalar(3)];
		//var equation = [context.Scalar(8), context.Operator("Subtract"), "(", "(", context.Scalar(8), context.Operator("Add"), context.Scalar(8), ")", context.Operator("Exponential"), "(", context.Scalar(1), context.Operator("Divide"), context.Scalar(2), ")", ")", context.Operator("Exponential"), "(", context.Scalar(1), context.Operator("Divide"), context.Scalar(2), ")"];

		/*
		var equation = [
		context.Scalar(4),
		context.Operator("Multiply"),
		context.Scalar(3),
		context.Operator("Multiply"),
		context.Scalar(2)
		]

		console.log(equation);
		console.log(context.solveEquation(equation));
		*/
		var x = context.Matrix([[2,3,1],[9,5,2],[3,4,6]]);
		console.log(x.getDeterminant());

		//var a = context.specialOperations.matrixMatrixProduct(x,y);
		//console.log(a);
		
		//var n = context.Scalar(9);
		//var b = context.specialOperations.scalarMatrixProduct(n, a);
		//console.log(b);
	}
	
	return context;
})({});