// Declare namespace
calculator_items = function ()
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
	self.Function = function (value, parameterCount)
	{
		var self = {};

		self.type = "Function";
		self.value = value;
		self.parameterCount = parameterCount;

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
		
		self.getMagnitude = function ()
		{
			// Make a negative number positive
			if (self.value < 0)
			{
				return self.value * -1;
			}
			
			// Otherwise return the value as it is
			return self.value;
		};
		
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
			var self = calculator_items.Vector(value);
		}
		// Otherwise it is a matrix
		else
		{
			var self = calculator_items.Matrix(value);
		}
		
		self.value = value;
		
		self.rows = value.length;
		self.columns = value[0].length;
		
		// Returns the orignal grid but with the rows and columns swapped
		self.getTranspose = function ()
		{
			var transpose = calculator_logic.generateZeroGrid(self.columns, self.rows);

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

			var determinant = calculator_items.Scalar(0);

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
				var minor = self.getMinorMatrix(calculator_items.Scalar(row), calculator_items.Scalar(0));

				if (positive)
				{
					// Add the minor determinant to the major determinant if we are on a positive row
					var determinantAddition = calculator_operations.multiply(self.value[row][0], minor.getDeterminant());
					determinant = calculator_operations.add(determinant, determinantAddition);
					
					// Switch from positive to negative
					positive = false;
				}
				else
				{
					// Otherwise subtract it
					var determinantAddition = calculator_operations.multiply(self.value[row][0], minor.getDeterminant());
					determinant = calculator_operations.subtract(determinant, determinantAddition);
					
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
			// If the amount of rows or columns of the matrix is 1 or less, a minor cannot be found
			if (self.rows <= 1 || self.columns <= 1)
			{
				return false;
			}
			
			// If the target row or column is outside the bounds of the matrix, return false
			if (self.rows - 1 < targetRow.value || self.columns - 1 < targetColumn.value)
			{
				return false;
			}
			
			// If the target row or column is less than 0, a minor cannot be found
			if (targetRow.value < 0 || targetColumn.value < 0)
			{
				return false;
			}
			
			// Create zero matrix with 1 less row and 1 less column than the matrix object
			var minor = calculator_logic.generateZeroGrid(self.rows - 1, self.columns - 1);

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

			var minors = calculator_logic.generateZeroGrid(self.rows, self.columns);

			var row = 0;
			while (row < self.rows)
			{
				var column = 0;
				while (column < self.columns)
				{
					// Gets the determinant of the minor matrix in that location, as a primitive float
					minors.value[row][column] = self.getMinorMatrix(calculator_items.Scalar(row), calculator_items.Scalar(column)).getDeterminant().value;

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
			var inverse = calculator_logic.scalarGridOperation(determinant, adjugate, function (a, b) { return a / b });

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
			var total = calculator_items.Scalar(0);

			// Loop throughy every element in the vector
			var r = 0;
			while (r < self.rows)
			{
				// Add together the square of every element in the vector
				var squareValue = calculator_operations.exponential(self.value[r][0], calculator_items.Scalar(2));
				total = calculator_operations.add(total, squareValue);
				r += 1;
			}

			// Return the square root of the total (pythagoras theorum)
			return calculator_operations.exponential(total, calculator_items.Scalar(0.5));
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
			return calculator_items.Grid(unitValue);
		};

		return self;
	};
	
	return self;
}();