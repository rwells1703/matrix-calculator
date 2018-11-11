// Declare namespace
calculator_equation_solver = function ()
{
	var self = {};
	
	// Takes an array, and replaces a specified section of that array with a new array
	var replaceArraySection = function (array, start, end, replacement)
	{
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	};
	
	self.Items = function ()
	{
		var self = {};
		
		// Scalar class, that holds a single numerical value
		self.Scalar = function (value)
		{
			var self = {};

			self.type = "Scalar";
			self.value = value;

			return self;
		};
		
		self.Grid = function (value)
		{
			// If it has 1 column and more than 1 row, it is a vector
			if (value[0].length == 1 && value.length != 1)
			{
				self = calculator_equation_solver.Items.Vector(value);
			}
			// Otherwise it is a matrix
			else
			{
				self = calculator_equation_solver.Items.Matrix(value);
			}
			
			self.value = value;
			
			self.rows = value.length;
			self.columns = value[0].length;
			
			return self;
		};
		
		// Matrix class, that holds a grid of numerical values
		// Inherits from the grid class, along with vector
		self.Matrix = function (value)
		{
			var self = {};

			self.type = "Matrix";

			// Returns if the matrix (number of rows = number of columns) is square or not
			self.getSquare = function ()
			{
				if (self.rows == self.columns)
				{
					// The matrix is square
					return true;
				}
				// Otherwise the matrix is not square
				return false;
			};

			// Returns the determinant of the matrix
			self.getDeterminant = function ()
			{
				// Must be a square matrix otherwise the determinant is undefined
				if (self.getSquare() == false)
				{
					return false;
				}

				var determinant = 0;

				// Recursive base case, we have reached the smallest matrix possible, a 1 x 1
				if (self.rows == 1 && self.columns == 1)
				{
					return calculator_equation_solver.Items.Scalar(self.value[0][0]);
				}

				// Start out positive and then switch sign on each row change
				var positive = true;

				// Use first column (but any column or row will give same result)
				var row = 0;
				while (row < self.rows)
				{
					var minor = self.getMinorMatrix(row, 0);

					if (positive)
					{
						// Add the minor determinant to the major determinant if we are on a positive row
						determinant += self.value[row][0] * minor.getDeterminant().value;
						// Switch from positive to negative
						positive = false;
					}
					else
					{
						// Otherwise subtract it
						determinant -= self.value[row][0] * minor.getDeterminant().value;
						// Switch from negative to positive
						positive = true;
					}

					row += 1;
				}

				return calculator_equation_solver.Items.Scalar(determinant);
			};

			// Returns the minor matrix for a specific element of the matrix  
			self.getMinorMatrix = function (targetRow, targetColumn)
			{
				// Create zero matrix with 1 less row and 1 less column than the matrix object
				var minor = calculator_equation_solver.Actions.generateZeroGrid(self.rows - 1, self.columns - 1);

				var minorRow = 0;
				var minorColumn = 0;

				var majorRow = 0;
				while (majorRow < self.rows)
				{
					var majorColumn = 0;
					while (majorColumn < self.columns)
					{
						// Avoid the row/column if it is the target row/column
						if (majorColumn != targetColumn && majorRow != targetRow)
						{
							// Store corresponding the value in the minor matrix
							minor.value[minorRow][minorColumn] = self.value[majorRow][majorColumn];

							// Taking 1 away from minor.rows and minor.columns is necessary because they start from 1 whereas arrays start from 0
							if (minorRow == minor.rows - 1 && minorColumn == minor.columns - 1)
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

			// Returns a matrix, where every element is equal to the determinant of the minor matrix of that element in the original matrix
			self.getMatrixOfMinors = function ()
			{
				var minors = calculator_equation_solver.Actions.generateZeroGrid(self.rows, self.columns);

				var row = 0;
				while (row < self.rows)
				{
					var column = 0;
					while (column < self.columns)
					{
						// Gets the determinant of the minor matrix in that location, as a primitive float
						minors.value[row][column] = self.getMinorMatrix(row, column).getDeterminant().value;

						column += 1;
					}

					row += 1;
				}

				return minors;
			};

			// Returns the matrix of cofactors but where the sign (+ or -) or each element follows a checkerboard pattern
			self.getMatrixOfCofactors = function ()
			{
				var minor = self.getMatrixOfMinors();

				// Multiplier value that will be either 1 or -1 depending on the location of the element
				var multiplier = 1;

				var row = 0;
				while (row < self.rows)
				{
					var column = 0;
					while (column < self.columns)
					{
						// Changes the sign of that element according to the checker board pattern
						minor.value[row][column] *= multiplier;

						// Changes the multiplier for the element to the left
						multiplier *= -1;
						column += 1;
					}

					// Changes the multiplier so that its starting value alternates every row
					multiplier = Math.pow(-1, row + 1);
					row += 1;
				}

				return minor;
			};

			// Returns the orignal matrix but with the rows and columns swapped
			self.getTranspose = function ()
			{
				var transpose = calculator_equation_solver.Actions.generateZeroGrid(self.rows, self.columns);

				var row = 0;
				while (row < self.rows)
				{
					var column = 0;
					while (column < self.columns)
					{
						// Swap the rows and columns of the element, and insert it into the transpose matrix
						transpose.value[column][row] = self.value[row][column];

						column += 1;
					}

					row += 1;
				}

				return transpose;
			};

			// Returns a matrix equal to the transpose of the matrix of cofactors, used in finding inverse matrices
			self.getAdjugate = function ()
			{
				var cofactors = self.getMatrixOfCofactors();
				var adjugate = cofactors.getTranspose();

				return adjugate;
			};

			// Calculates the inverse of the original matrix
			// For the inverse, the following must hold true: original * inverse = identity
			self.getInverse = function ()
			{
				var adjugate = self.getAdjugate();
				var determinant = self.getDeterminant();

				// Inverse is equal to: adjugate * 1/determinant
				var inverse = calculator_equation_solver.Actions.scalarGridOperation(determinant, adjugate, function (a, b) { return a / b });

				return inverse;
			};

			return self;
		};
		
		// Vector class, that holds a single row of numerical values
		// Inherits from the grid class, along with martrix
		self.Vector = function (value)
		{
			self = {};
			
			self.type = "Vector";

			// Returns the magnitude (length) of the vector, denoted |v| where v is a vector
			self.getMagnitude = function ()
			{
				var total = 0;

				// Loop throughy every element in the vector
				var r = 0;
				while (r < self.rows)
				{
					// Add together the square of every element in the vector
					total += Math.pow(self.value[r][0], 2);
					r += 1;
				}

				// Return the square root of the total (pythagoras theorum)
				return calculator_equation_solver.Items.Scalar(Math.pow(total, 0.5));
			};

			// Returns a vector object, with the magnitude 1 in the same direction as this vector
			self.getUnitVector = function ()
			{
				var unitValue = new Array(self.rows);
				var magnitude = self.getMagnitude();

				// Loop throughy every element in the vector
				var r = 0;
				while (r < self.rows)
				{
					unitValue[r] = [self.value[r] / magnitude.value];
					r += 1;
				}

				// Return a new vector object with the correct unit vector values
				return calculator_equation_solver.Items.Grid(unitValue);
			};

			return self;
		};
		
		return self;
	}();
	
	self.Operations = function ()
	{
		var self = {};
		
		self.add = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarScalarOperation(left, right, function (a, b) { return a + b });
			}
			// SM SV 
			else if (left.type == "Scalar" && right.type == "Matrix" || left.type == "Scalar" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(left, right, function (a, b) { return a + b });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return a + b });
			}
			// MM VV
			else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Vector" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.gridGridElementWiseOperation(left, right, function (a, b) { return a + b });
			}
			
			return false;
		};
		
		self.subtract = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarScalarOperation(left, right, function (a, b) { return a - b });
			}
			// SM SV 
			else if (left.type == "Scalar" && right.type == "Matrix" || left.type == "Scalar" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(left, right, function (a, b) { return a - b });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return a - b });
			}
			// MM VV
			else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Vector" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.gridGridElementWiseOperation(left, right, function (a, b) { return a - b });
			}
			
			return false;
		};
		
		self.multiply = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarScalarOperation(left, right, function (a, b) { return a * b });
			}
			// SM SV 
			else if (left.type == "Scalar" && right.type == "Matrix" || left.type == "Scalar" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(left, right, function (a, b) { return a * b });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return a * b });
			}
			// MM MV
			else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Matrix" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.gridGridProduct(left, right);
			}
			
			return false;
		};
		
		self.divide = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarScalarOperation(left, right, function (a, b) { return a / b });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return a / b });
			}
			
			return false;
		};
		
		self.exponent = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarScalarOperation(left, right, function (a, b) { return a ** b });
			}
			//MS
			if (left.type == "Matrix" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.matrixExponent(left, right);
			}
			
			return false;
		};
		
		self.permutations = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.permutations(left, right);
			}
			
			return false;
		};
		
		self.combinations = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.combinations(left, right);
			}
			
			return false;
		};
		
		self.factorial = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.factorial(operand);
			}
			
			return false;
		};
		
		self.sin = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.sin(operand);
			}
			
			return false;
		};
		
		self.cos = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.cos(operand);
			}
			
			return false;
		};
		
		self.tan = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.tan(operand);
			}
			
			return false;
		};
		
		self.arcsin = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.arcsin(operand);
			}
			
			return false;
		};
		
		self.arccos = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.arccos(operand);
			}
			
			return false;
		};
		
		self.arctan = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.arctan(operand);
			}
			
			return false;
		};
		
		self.log = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.log(operand);
			}
			
			return false;
		};
		
		self.ln = function (operand)
		{
			// S
			if (operand.type == "Scalar")
			{
				return calculator_equation_solver.Actions.ln(operand);
			}
			
			return false;
		};
		

		

		
		self.transpose = function ()
		{
		};
		
		self.determinant = function ()
		{
		};
		
		self.minor = function ()
		{
		};
		
		self.minors = function ()
		{
		};
		
		self.cofactors = function ()
		{
		};
		
		self.adjugate = function ()
		{
		};
		
		
		
		self.dot = function ()
		{
		};
		
		self.cross = function ()
		{
		};
		
		return self;
	}();
	
	self.Actions = function ()
	{
		var self = {};
		
		self.scalarScalarOperation = function (left, right, operation)
		{
			var value = operation(left.value, right.value);
			
			return calculator_equation_solver.Items.Scalar(value);
		};
		
		self.factorial = function (scalar)
		{
			// Factorial is undefined for n < 0
			if (scalar.value < 0)
			{
				return false;
			}
			
			// // Base case ends recusrsion, due to identity 0! = 1
			if (scalar.value == 0)
			{
				return calculator_equation_solver.Items.Scalar(1);
			}
			
			// General case, continue recursion for n - 1
			var value = calculator_equation_solver.Operations.multiply(scalar, calculator_equation_solver.Actions.factorial(calculator_equation_solver.Items.Scalar(scalar.value - 1)));
			return value;
		};
		
		self.permutations = function (n, r)
		{
			var numerator = calculator_equation_solver.Actions.factorial(n);
			var denominator = calculator_equation_solver.Actions.factorial(calculator_equation_solver.Items.Scalar(n.value - r.value));
			
			return calculator_equation_solver.Operations.divide(numerator, denominator);
		};
		
		self.combinations = function (n, r)
		{
			var permutations = calculator_equation_solver.Actions.permutations(n, r);
			var divisor = calculator_equation_solver.Actions.factorial(r);
			
			return calculator_equation_solver.Operations.divide(permutations, divisor);
		};
		
		self.sin = function (scalar)
		{
			return calculator_equation_solver.Items.Scalar(Math.sin(scalar.value));
		};
		
		self.cos = function (scalar)
		{
			return calculator_equation_solver.Items.Scalar(Math.cos(scalar.value));
		};
		
		self.tan = function (scalar)
		{
			return calculator_equation_solver.Items.Scalar(Math.tan(scalar.value));
		};
		
		self.arcsin = function(scalar)
		{
			if (scalar.value < -1 || scalar.value > 1)
			{
				return false;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.asin(scalar.value));
		};
		
		self.arccos = function(scalar)
		{
			if (scalar.value < -1 || scalar.value > 1)
			{
				return false;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.acos(scalar.value));
		};
		
		self.arctan = function(scalar)
		{
			return calculator_equation_solver.Items.Scalar(Math.atan(scalar.value));
		};
		
		self.log = function(scalar)
		{
			// Logs are undefined for negative numbers
			if (scalar.value < 0)
			{
				return false;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.log10(scalar.value));
		};
		
		self.ln = function(scalar)
		{
			// Logs are undefined for negative numbers
			if (scalar.value < 0)
			{
				return false;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.log(scalar.value));
		};
		
		// Performs an operation involving a scalar, on every element of a grid (matrix or vector) e.g. multiplication or addition
		self.scalarGridOperation = function (scalar, grid, operation)
		{
			// Generate a new zero grid, the same size as the origial grid, that will hold the output
			var output = calculator_equation_solver.Actions.generateZeroGrid(grid.rows, grid.columns);

			var r = 0;
			while (r < grid.rows)
			{
				var c = 0;
				while (c < grid.columns)
				{
					// Perform the operation on the specified input grid element and save it to the output grid
					output.value[r][c] = operation(grid.value[r][c], scalar.value);

					c += 1;
				}

				r += 1;
			}

			return output;
		};
		
		// Multiplies two grids and returns the product, as a grid
		self.gridGridProduct = function (left, right)
		{
			// Check to see if both grids are conformable
			//E.g. a has n x m order and b has j x k order
			//For them to be conformable, m and j must be the same
			if (left.columns != right.rows)
			{
				return false;
			}

			// Create zero grid to correct order
			// E.g. a has n x m order and b has j x k order
			// The product, ab will have n x k order
			var product = calculator_equation_solver.Actions.generateZeroGrid(left.rows, right.columns);

			// The multiplication itself
			var left_row = 0;
			while (left_row < left.rows)
			{
				var right_column = 0;
				while (right_column < right.columns)
				{
					// Could have been to left.columns or right.rows
					// Both of these values should be the same if the grids are conformable
					var shift = 0;
					while (shift < left.columns)
					{
						// Perform the multiplication and place the product in the correct place in the product grid
						product.value[left_row][right_column] += left.value[left_row][shift] * right.value[shift][right_column];
						shift += 1;
					}

					right_column += 1;
				}

				left_row += 1;
			}

			return product;
		};
		
		// Performs an element wise operation on two grids and returns the resultant grid
		self.gridGridElementWiseOperation = function (left, right, operation)
		{
			// Check to see if both grids are the same size
			if (left.columns != right.columns || left.rows != right.rows)
			{
				return false;
			}

			// Create zero grid to the same order
			var output = calculator_equation_solver.Actions.generateZeroGrid(left.rows, left.columns);

			var r = 0;
			while (r < left.rows)
			{
				var c = 0;
				while (c < left.columns)
				{
					// Perform the operation on the specified input grid elements and save it to the output grid
					output.value[r][c] = operation(left.value[r][c], right.value[r][c]);

					c += 1;
				}

				r += 1;
			}

			return output;
		};
		
		// Creates a grid containing all zeros of the specified order
		self.generateZeroGrid = function (rows, columns)
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

			// Create a new grid object containing the zero grid values
			return calculator_equation_solver.Items.Grid(elements);
		};
		
		// Creates a square matrix containing a diagonal of 1s from top left to bottom right of the specified order
		self.generateIdentityMatrix = function (size)
		{	
			var elements = [];

			var r = 0;
			while (r < size)
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
			return calculator_equation_solver.Items.Grid(elements);
		};
		
		self.matrixExponent = function (matrix, scalar)
		{
			// Create zero grid to the same order as the matrix
			var output = matrix;
			
			var n = scalar.value - 1;
			while (n > 0)
			{
				output = calculator_equation_solver.Actions.gridGridProduct(output, matrix);
				n -= 1;
			}
			
			return output;
		};
		
		return self;
	}();
	
	self.solve = function ()
	{
		var x = calculator_equation_solver.Items.Scalar(4);
		var y = calculator_equation_solver.Items.Scalar(2);
		
		var a = calculator_equation_solver.Items.Grid([[2,4],[5,3]]);
		var b = calculator_equation_solver.Items.Grid([[5,1],[9,5]]);
		
		console.log(calculator_equation_solver.Operations.combinations(x,y));
	};
	
	return self;
}();