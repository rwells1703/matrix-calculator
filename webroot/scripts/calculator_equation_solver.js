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
			
		// Bracket class that will be either of the following:
		// equation bracket ( ) or function bracket [ ]
		self.Bracket = function (value)
		{
			var self = {};
			
			self.type = "Bracket";
			self.value = value;
			
			return self;
		};
		
		// Operator class, holds an operator that takes in a fixed number of inputs and gives an output
		self.Operator = function (value)
		{
			var self = {};

			self.type = "Operator";
			self.value = value;

			return self;
		};

		// Function class, holds a function that takes in one or more inputs and gives an output
		self.Function = function (value)
		{
			var self = {};

			self.type = "Function";
			self.value = value;

			return self;
		};

		// Flag class will be used in equations for specifying what type of output a function should give e.g. You can either use the "Radians" or "Degrees" flag for Trigonometric functions.
		self.Flag = function (value)
		{
			var self = {};

			self.type = "Flag";
			self.value = value;

			return self;
		};

		// Scalar class, that holds a single numerical value
		self.Scalar = function (value)
		{
			// Returns false if the input value was false
			// Must verify that it is a boolean as js evaluates the number 0 to be false, causing problems
			if (value == false && typeof(value) == "boolean")
			{
				return false;
			}
			
			var self = {};
			
			self.type = "Scalar";
			self.value = value;

			return self;
		};
		
		// Grid class, holds a grid of numbers, both matrix and vector inherit from this
		self.Grid = function (value)
		{
			// Verifies that the grid of numbers is correctly structured so that it is an nxm rectangle
			if (value)
			{
				// The grid exists

				if (Array.isArray(value))
				{
					// The grid is an array
					var rows = value.length;
		
					var r = 0;
					while (r < rows)
					{
						var columns;
		
						if (value[r])
						{
							// The row exists

							if (Array.isArray(value[r]))
							{
								// The row is an array
					
								if (value[r].length != columns && columns != undefined)
								{
									// The size of this column is different than the others
									// This condition is not triggered if it is the first column being checked
									// Cannot be a grid is some columns are longer than others
									return false;
								}
								else if (value[r] == false)
								{
									// Return false instead of a Grid object if any of the values are false
									return false;
								}
								else
								{
									// Set the column length to be the length of the current column
									columns = value[r].length;
								}
							}
							else
							{
								// This row is not an array
								return false;
							}
						}
		
						r += 1;
					}
				}
			}

			// If it has 1 column and more than 1 row, it is a vector
			if (value[0].length == 1 && value.length != 1)
			{
				var self = calculator_equation_solver.Items.Vector(value);
			}
			// Otherwise it is a matrix
			else
			{
				var self = calculator_equation_solver.Items.Matrix(value);
			}
			
			self.value = value;
			
			self.rows = value.length;
			self.columns = value[0].length;
			
			// Returns the orignal grid but with the rows and columns swapped
			self.getTranspose = function ()
			{
				var transpose = calculator_equation_solver.Actions.generateZeroGrid(self.columns, self.rows);

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

				var determinant = calculator_equation_solver.Items.Scalar(0);

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
					var minor = self.getMinorMatrix(calculator_equation_solver.Items.Scalar(row), calculator_equation_solver.Items.Scalar(0));

					if (positive)
					{
						// Add the minor determinant to the major determinant if we are on a positive row
						var determinantAddition = calculator_equation_solver.Operations.multiply(self.value[row][0], minor.getDeterminant());
						determinant = calculator_equation_solver.Operations.add(determinant, determinantAddition);
						// Switch from positive to negative
						positive = false;
					}
					else
					{
						// Otherwise subtract it
						var determinantAddition = calculator_equation_solver.Operations.multiply(self.value[row][0], minor.getDeterminant());
						determinant = calculator_equation_solver.Operations.subtract(determinant, determinantAddition);
						// Switch from negative to positive
						positive = true;
					}

					row += 1;
				}
				
				return determinant;
			};

			// Returns the minor matrix for a specific element of the matrix  
			self.getMinorMatrix = function (targetRow, targetColumn)
			{
				if (self.rows < 2 || self.columns < 2)
				{
					return false;
				}

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
						if (majorColumn != targetColumn.value && majorRow != targetRow.value)
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
				// Must be a square matrix otherwise the matrix of minors is undefined
				if (self.getSquare() == false)
				{
					return false;
				}

				var minors = calculator_equation_solver.Actions.generateZeroGrid(self.rows, self.columns);

				var row = 0;
				while (row < self.rows)
				{
					var column = 0;
					while (column < self.columns)
					{
						// Gets the determinant of the minor matrix in that location, as a primitive float
						minors.value[row][column] = self.getMinorMatrix(calculator_equation_solver.Items.Scalar(row), calculator_equation_solver.Items.Scalar(column)).getDeterminant().value;

						column += 1;
					}

					row += 1;
				}

				return minors;
			};

			// Returns the matrix of cofactors but where the sign (+ or -) or each element follows a checkerboard pattern
			self.getMatrixOfCofactors = function ()
			{
				var minors = self.getMatrixOfMinors();

				if (minors == false)
				{
					return false;
				}

				// Multiplier value that will be either 1 or -1 depending on the location of the element
				var multiplier = 1;

				var row = 0;
				while (row < self.rows)
				{
					var column = 0;
					while (column < self.columns)
					{
						// Changes the sign of that element according to the checker board pattern
						minors.value[row][column] *= multiplier;

						// Changes the multiplier for the element to the left
						multiplier *= -1;
						column += 1;
					}

					// Changes the multiplier so that its starting value alternates every row
					multiplier = Math.pow(-1, row + 1);
					row += 1;
				}

				return minors;
			};

			// Returns a matrix equal to the transpose of the matrix of cofactors, used in finding inverse matrices
			self.getAdjugate = function ()
			{
				var cofactors = self.getMatrixOfCofactors();

				if (cofactors == false)
				{
					return false;
				}

				var adjugate = cofactors.getTranspose();

				return adjugate;
			};

			// Calculates the inverse of the original matrix
			// For the inverse, the following must hold true: original * inverse = identity
			self.getInverse = function ()
			{
				var adjugate = self.getAdjugate();

				if (adjugate == false)
				{
					return false;
				}

				var determinant = self.getDeterminant();

				if (determinant.value == 0)
				{
					return false;
				}

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
			var self = {};
			
			self.type = "Vector";

			// Returns the magnitude (length) of the vector, denoted |v| where v is a vector
			self.getMagnitude = function ()
			{
				var total = calculator_equation_solver.Items.Scalar(0);

				// Loop throughy every element in the vector
				var r = 0;
				while (r < self.rows)
				{
					// Add together the square of every element in the vector
					var squareValue = calculator_equation_solver.Operations.exponential(self.value[r][0], calculator_equation_solver.Items.Scalar(2));
					total = calculator_equation_solver.Operations.add(total, squareValue);
					r += 1;
				}

				// Return the square root of the total (pythagoras theorum)
				return calculator_equation_solver.Operations.exponential(total, calculator_equation_solver.Items.Scalar(0.5));
			};

			// Returns a vector object, with the magnitude 1 in the same direction as this vector
			self.normalize = function ()
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
	
	// Holds all the operations that can be performed on items (both functions and operators)
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
				return calculator_equation_solver.Actions.scalarGridOperation(left, right, function (a, b) { return calculator_equation_solver.Operations.add(a,b) });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return calculator_equation_solver.Operations.add(a,b) });
			}
			// MM VV
			else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Vector" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.gridGridElementWiseOperation(left, right, function (a, b) { return calculator_equation_solver.Operations.add(a,b) });
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
				return calculator_equation_solver.Actions.scalarGridOperation(left, right, function (a, b) { return calculator_equation_solver.Operations.subtract(a,b) });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return calculator_equation_solver.Operations.subtract(a,b) });
			}
			// MM VV
			else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Vector" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.gridGridElementWiseOperation(left, right, function (a, b) { return calculator_equation_solver.Operations.subtract(a,b) });
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
				return calculator_equation_solver.Actions.scalarGridOperation(left, right, function (a, b) { return calculator_equation_solver.Operations.multiply(a,b) });
			}
			// MS VS
			else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return calculator_equation_solver.Operations.multiply(a,b) });
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
				return calculator_equation_solver.Actions.scalarGridOperation(right, left, function (a, b) { return calculator_equation_solver.Operations.divide(a,b) });
			}
			
			return false;
		};
		
		self.exponential = function (left, right)
		{
			// SS
			if (left.type == "Scalar" && right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.scalarScalarOperation(left, right, function (a, b) { return a ** b });
			}
			// MS
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
		
		self.factorial = function (left)
		{
			// S
			if (left.type == "Scalar")
			{
				return calculator_equation_solver.Actions.factorial(left);
			}
			
			return false;
		};
		
		self.sin = function (right, angleUnit)
		{
			// S
			if (right.type == "Scalar" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.sin(right, angleUnit);
			}
			
			return false;
		};
		
		self.cos = function (right, angleUnit)
		{
			// S
			if (right.type == "Scalar" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.cos(right, angleUnit);
			}
			
			return false;
		};
		
		self.tan = function (right, angleUnit)
		{
			// S
			if (right.type == "Scalar" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.tan(right, angleUnit);
			}
			
			return false;
		};
		
		self.arcsin = function (right, angleUnit)
		{
			// S
			if (right.type == "Scalar" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.arcsin(right, angleUnit);
			}
			
			return false;
		};
		
		self.arccos = function (right, angleUnit)
		{
			// S
			if (right.type == "Scalar" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.arccos(right, angleUnit);
			}
			
			return false;
		};
		
		self.arctan = function (right, angleUnit)
		{
			// S
			if (right.type == "Scalar" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.arctan(right, angleUnit);
			}
			
			return false;
		};
		
		self.log = function (argument, base)
		{
			// S
			if (argument.type == "Scalar" && base.type == "Scalar")
			{
				return calculator_equation_solver.Actions.log(argument, base);
			}
			
			return false;
		};
		
		self.ln = function (right)
		{
			// S
			if (right.type == "Scalar")
			{
				return calculator_equation_solver.Actions.ln(right);
			}
			
			return false;
		};
		
		self.transpose = function (left)
		{
			// M V
			if (left.type == "Matrix" || left.type == "Vector")
			{
				return left.getTranspose();
			}

			return false;
		};
		
		self.determinant = function (right)
		{
			// M
			if (right.type == "Matrix")
			{
				return right.getDeterminant();
			}

			return false;
		};
		
		self.minor = function (operand, row, column)
		{
			// M
			if (operand.type == "Matrix" && row.type == "Scalar" && column.type == "Scalar")
			{
				return operand.getMinorMatrix(row, column);
			}

			return false;
		};
		
		self.minors = function (right)
		{
			// M
			if (right.type == "Matrix")
			{
				return right.getMatrixOfMinors();
			}

			return false;
		};
		
		self.cofactors = function (right)
		{
			// M
			if (right.type == "Matrix")
			{
				return right.getCofactors();
			}
			
			return false;
		};
		
		self.adjugate = function (right)
		{
			// M
			if (right.type == "Matrix")
			{
				return right.getAdjugate();
			}
			
			return false;
		};
		
		self.dotProduct = function (left, right)
		{
			// VV
			if (left.type == "Vector" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.dotProduct(left, right);
			}
			
			return false;
		};
		
		self.vectorVectorAngle = function(left, right, angleUnit)
		{
			// VV
			if (left.type == "Vector" && right.type == "Vector" && angleUnit.type == "Flag")
			{
				return calculator_equation_solver.Actions.vectorVectorAngle(left, right, angleUnit);
			}
			
			return false;
		};
		
		self.crossProduct = function (left, right)
		{
			// VV
			if (left.type == "Vector" && right.type == "Vector")
			{
				return calculator_equation_solver.Actions.normalVector([left, right]);
			}
			
			return false;
		};
		
		self.normalVector = function (vectors)
		{
			// V VV VVV VVVV and so on...
			var i = 0;
			while (i < vectors.length)
			{
				if (vectors[i].type != "Vector")
				{
					return false;
				}
				
				i += 1;
			}
			
			return calculator_equation_solver.Actions.normalVector(vectors);
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
		
		self.sin = function (scalar, angleUnit)
		{
			var inputValue = scalar.value;
			
			if (angleUnit == "degrees")
			{
				inputValue *= Math.PI/180;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.sin(inputValue));
		};
		
		self.cos = function (scalar, angleUnit)
		{
			var inputValue = scalar.value;
			
			if (angleUnit == "degrees")
			{
				inputValue *= Math.PI/180;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.cos(inputValue));
		};
		
		self.tan = function (scalar, angleUnit)
		{
			var inputValue = scalar.value;
			
			if (angleUnit == "degrees")
			{
				inputValue *= Math.PI/180;
			}
			
			return calculator_equation_solver.Items.Scalar(Math.tan(inputValue));
		};
		
		self.arcsin = function (scalar, angleUnit)
		{
			if (scalar.value < -1 || scalar.value > 1)
			{
				return false;
			}
			
			var angle = Math.asin(scalar.value);
			
			if (angleUnit == "degrees")
			{
				angle *= 180/Math.PI;
			}
			
			return calculator_equation_solver.Items.Scalar(angle);
		};
		
		self.arcsin = function (scalar, angleUnit)
		{
			if (scalar.value < -1 || scalar.value > 1)
			{
				return false;
			}
			
			var angle = Math.acos(scalar.value);
			
			if (angleUnit == "degrees")
			{
				angle *= 180/Math.PI;
			}
			
			return calculator_equation_solver.Items.Scalar(angle);
		};
		
		self.arctan = function (scalar, angleUnit)
		{
			var angle = Math.atan(scalar.value);
			
			if (angleUnit == "degrees")
			{
				angle *= 180/Math.PI;
			}
			
			return calculator_equation_solver.Items.Scalar(angle);
		};
		
		self.log = function (scalar, base)
		{
			// Logs are undefined for negative numbers
			if (scalar.value < 0)
			{
				return false;
			}
			
			if (base == undefined)
			{
				var base = calculator_equation_solver.Items.Scalar(10);
			}
			
			var numerator = Math.log(scalar.value);
			var denominator = Math.log(base.value);
			
			// "log base b of a" is equal to "log a / log b"
			return calculator_equation_solver.Items.Scalar(numerator / denominator);
		};
		
		self.ln = function (scalar)
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
					output.value[r][c] = operation(grid.value[r][c], scalar);
					
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
						var additionValue = calculator_equation_solver.Operations.multiply(left.value[left_row][shift],right.value[shift][right_column]);
						product.value[left_row][right_column] = calculator_equation_solver.Operations.add(product.value[left_row][right_column], additionValue);
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
					elements[r].push(calculator_equation_solver.Items.Scalar(0));
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
						elements[r].push(calculator_equation_solver.Items.Scalar(1));
					}
					else
					{
						// Otherwise set the value to 0
						elements[r].push(calculator_equation_solver.Items.Scalar(0));
					}

					c += 1;
				}

				r += 1;
			}

			// Create a new matrix object containing the identity matrix values
			return calculator_equation_solver.Items.Grid(elements);
		};
		
		// Multiplies a matrix by itself the corresponding number of times
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
		
		// Takes two vectors and returns their dot product (corresponding components multiplied together)
		self.dotProduct = function (left, right)
		{
			// Verify that the vectors are of the same dimension
			if (left.rows != right.rows)
			{
				return false;
			}

			var total = calculator_equation_solver.Items.Scalar(0);

			// Loop through each row (dimension) of the vectors
			var r = 0;
			while (r < left.rows)
			{
				// Multiply the vectors together in the same dimension, and add this value to the total
				var product = calculator_equation_solver.Operations.multiply(left.value[r][0], right.value[r][0]);
				total = calculator_equation_solver.Operations.add(total, product);
				r += 1;
			}

			return total;
			//return calculator_equation_solver.Items.Scalar(total);
		};
		
		// Takes n-1 vectors of n dimensions and calculates a vector orthogonal to all the input vectors
		self.normalVector = function (vectors)
		{
			// Check that all the vectors have the same dimensions
			var len;

			var i = 0;
			while (i < vectors.length)
			{
				if (vectors[i].value)
				{
					if (Array.isArray(vectors[i].value))
					{
						if (vectors[i].value.length != len && len != undefined)
						{
							return false;
						}
						else
						{
							// Set the column length to be the length of the current column
							len = vectors[i].value.length;
						}
					}
				}

				i += 1;
			}

			// Verify that we have n vectors, each of n+1 dimensions e.g. we need 2 lots of 3d vectors, or 4 lots of 5d vectors
			if (vectors.length != len - 1)
			{
				return false;
			}

			// Create the an empty nxn Grid where n is the dimension of all the vectors
			var matrix = calculator_equation_solver.Actions.generateZeroGrid(len, len);
			
			// Gets a set of basis vectors to be inserted into the top row of the matrix
			var basisVectors = calculator_equation_solver.Actions.generateBasisVectors(len);

			// Inserts the basis vectors into the top row of the matrix
			var c = 0;
			while (c < len)
			{
				matrix.value[0][c] = basisVectors[c];
				
				c += 1;
			}
			
			// Inserts the input vectors into the other rows of the matrix
			var r = 1;
			while (r < len)
			{
				var c = 0;
				while (c < len)
				{
					matrix.value[r][c] = vectors[r-1].value[c][0];
					
					c += 1;
				}
				
				r += 1;
			}
			
			// Calculates the determiant of the matrix via laplace decomposition to get a value for a normal vector
			var normalVector = matrix.getDeterminant();
			
			return normalVector;
		};
		
		// Gets the angle between two vectors using the dot product identity
		self.vectorVectorAngle = function (left, right, angleType)
		{
			var dotProduct = calculator_equation_solver.Actions.dotProduct(left,right);
			var magnitudeProduct = calculator_equation_solver.Operations.multiply(left.getMagnitude(), right.getMagnitude());
			
			if (magnitudeProduct.value == 0)
			{
				return false;
			}

			var cosineAngle = calculator_equation_solver.Operations.divide(dotProduct, magnitudeProduct);

			// Return the angle in the specified unit
			// In degrees
			if (angleType == "degrees")
			{
				var angle = calculator_equation_solver.Operations.multiply(calculator_equation_solver.Operations.arccos(cosineAngle), calculator_equation_solver.Items.Scalar(180 / Math.PI));
			}
			// Otherwise use radians
			else
			{
				var angle = calculator_equation_solver.Operations.arccos(cosineAngle);
			}

			return angle;
		};

		// Returns an array of basis vectors for the specified number of dimensions e.g. for 2 dimensions it will return [1,0] and [0,1]
		self.generateBasisVectors = function (dimensions)
		{
			// Create an empty array to hold all the new basis vectors
			var vectors = [];

			var d = 0;
			while (d < dimensions)
			{
				// Create an empty vector of the correct dimension
				var basisVector = calculator_equation_solver.Actions.generateZeroGrid(dimensions, 1);
				// Assign the correct component of the vector a scalar value of 1
				basisVector.value[d] = [calculator_equation_solver.Items.Scalar(1)];
				// Add the new basis vector to the array of basis vectors
				vectors.push(basisVector);

				d += 1;
			}

			return vectors;
		};

		return self;
	}();
	
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
					var bracketSolution = calculator_equation_solver.solveEquation(equation.slice(openBracketLocation + 1, i));
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

		// FUNCTIONS
		var i = 0;
		while (i < equation.length - 3)
		{
			if (equation[i].type == "Function")
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
				var bracketClosedLocation = 0;
				
				// Start on the item after the open operation bracket
				var j = i + 2;
				while (j < equation.length && bracketClosed == false)
				{
					if (equation[j].value == "]")
					{
						// Save where the close operation bracket is so that solveEquation knows what part of the equation to replaec with the solution
						bracketClosed = true;
						bracketClosedLocation = j;
					}
					else
					{
						// Otherwise add the operand to the list of operands
						operands.push(equation[j]);
					}
					
					j += 1;
				}
				
				if (bracketClosed == false)
				{
					return false;
				}
				
				if (equation[i].value == "Normal Vector")
				{
					var solution = calculator_equation_solver.Operations.normalVector.apply(this, operands);
				}
				if (equation[i].value == "Vector Vector Angle")
				{
					var solution = calculator_equation_solver.Operations.vectorVectorAngle.apply(this, operands);
				}
				if (equation[i].value == "Minor")
				{
					var solution = calculator_equation_solver.Operations.minor.apply(this, operands);
				}
				else if (equation[i].value == "Log")
				{
					var solution = calculator_equation_solver.Operations.log.apply(this, operands);
				}
				else if (equation[i].value == "Ln")
				{
					var solution = calculator_equation_solver.Operations.ln.apply(this, operands);
				}
				else if (equation[i].value == "Sin")
				{
					var solution = calculator_equation_solver.Operations.sin.apply(this, operands);
				}
				else if (equation[i].value == "Cos")
				{
					var solution = calculator_equation_solver.Operations.cos.apply(this, operands);
				}
				else if (equation[i].value == "Tan")
				{
					var solution = calculator_equation_solver.Operations.tan.apply(this, operands);
				}
				else if (equation[i].value == "Arcsin")
				{
					var solution = calculator_equation_solver.Operations.arcsin.apply(this, operands);
				}
				else if (equation[i].value == "Arccos")
				{
					var solution = calculator_equation_solver.Operations.arccos.apply(this, operands);
				}
				else if (equation[i].value == "Arctan")
				{
					var solution = calculator_equation_solver.Operations.arctan.apply(this, operands);
				}
				else if (equation[i].value == "Permutations")
				{
					var solution = calculator_equation_solver.Operations.permutations.apply(this, operands);
				}
				else if (equation[i].value == "Combinations")
				{
					var solution = calculator_equation_solver.Operations.combinations.apply(this, operands);
				}
				else
				{
					// Function brackets were used when there is no function
					return false;
				}
				
				if (solution == false)
				{
					return false;
				}
				
				equation = replaceArraySection(equation, i, bracketClosedLocation, solution);
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
				var solution = calculator_equation_solver.Operations.crossProduct(equation[i - 1], equation[i + 1]);
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
				var solution = calculator_equation_solver.Operations.dotProduct(equation[i - 1], equation[i + 1]);
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
				//var value = Math.pow(equation[i - 1].value, equation[i + 1].value);
				var solution = calculator_equation_solver.Operations.exponential(equation[i - 1], equation[i + 1]);
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
			if (equation[i].value == "Divide")
			{
				var solution = calculator_equation_solver.Operations.divide(equation[i - 1], equation[i + 1]);
				if (solution == false)
				{
					return false;
				}
				equation = replaceArraySection(equation, i - 1, i + 1, solution);
			}
			else if (equation[i].value == "Multiply")
			{
				var solution = calculator_equation_solver.Operations.multiply(equation[i - 1], equation[i + 1]);
				equation = replaceArraySection(equation, i - 1, i + 1, solution);
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
				var solution = calculator_equation_solver.Operations.add(equation[i - 1], equation[i + 1]);
				equation = replaceArraySection(equation, i - 1, i + 1, solution);
			}
			else if (equation[i].value == "Subtract")
			{
				var solution = calculator_equation_solver.Operations.subtract(equation[i - 1], equation[i + 1]);
				equation = replaceArraySection(equation, i - 1, i + 1, solution);
			}
			else
			{
				i += 1;
			}
		}

		return equation;
	};
	
	self.solve = function ()
	{
		var scalarA = calculator_equation_solver.Items.Scalar(1);
		var scalarB = calculator_equation_solver.Items.Scalar(0);
		
		var vectorA = calculator_equation_solver.Items.Grid([[calculator_equation_solver.Items.Scalar(3)],[calculator_equation_solver.Items.Scalar(5)],[calculator_equation_solver.Items.Scalar(1)]]);
		var vectorB = calculator_equation_solver.Items.Grid([[calculator_equation_solver.Items.Scalar(7)],[calculator_equation_solver.Items.Scalar(1)],[calculator_equation_solver.Items.Scalar(3)]]);
		var vectorC = calculator_equation_solver.Items.Grid([[calculator_equation_solver.Items.Scalar(5)],[calculator_equation_solver.Items.Scalar(2)],[calculator_equation_solver.Items.Scalar(0)]]);
		
		var matrixA = calculator_equation_solver.Items.Grid([[calculator_equation_solver.Items.Scalar(1),calculator_equation_solver.Items.Scalar(2)],[calculator_equation_solver.Items.Scalar(3),calculator_equation_solver.Items.Scalar(4)]]);
		
		var add = calculator_equation_solver.Items.Operator("Add");
		var exponential = calculator_equation_solver.Items.Operator("Exponential");
		var dot = calculator_equation_solver.Items.Operator("Dot Product");
		var cross = calculator_equation_solver.Items.Operator("Cross Product");
		var determinant = calculator_equation_solver.Items.Operator("Determinant");
		var minor = calculator_equation_solver.Items.Function("Minor");
		var normal = calculator_equation_solver.Items.Function("Normal Vector");
		
		var openOperationBracket = calculator_equation_solver.Items.Bracket("[");
		var closeOperationBracket = calculator_equation_solver.Items.Bracket("]");
		
		var equation = [minor, openOperationBracket, matrixA, scalarA, scalarB, closeOperationBracket];
		console.log(calculator_equation_solver.solveEquation(equation));
	}
	
	return self;
}();