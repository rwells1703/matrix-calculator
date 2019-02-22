// Declare namespace
calculator_items = function ()
{
	var self = {};
	
	// Bracket class that will be either of the following:
	// equation bracket ( ) or variadic bracket [ ]
	self.Bracket = function (value)
	{
		var self = {};
		
		self.type = "Bracket";

		// Property holds the type of bracket this item represents
		self.value = value;
		
		return self;
	};
	
	// Operation class, holds an operation that takes in a number of inputs and gives an output (used for both operators and functions)
	self.Operation = function (value, variadicFunction)
	{
		self = {};

		self.type = "Operation";

		// Property holds the type of operation this item represents
		self.value = value;

		// Property specifies whether the function is variadic
		self.variadicFunction = variadicFunction;

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

		// Holds the value of this scalar as a number
		self.value = value;
		
		// Gets the magnitude/absolute value of the scalar (must be a positive number)
		self.getMagnitude = function ()
		{
			// Make a negative number positive
			if (self.value < 0)
			{
				// Multiply its value by -1 and return a new scalar
				return calculator_items.Scalar(self.value * -1);
			}
			
			// Otherwise return the value as it is
			return calculator_items.Scalar(self.value);
		};
		
		return self;
	};
	
	// Grid class, holds a grid of numbers, both matrix and vector inherit from this
	self.Grid = function (value, itemReference)
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
		
		// Property holding an array of all the grid's elements
		self.value = value;
		
		// Properties specifying the amount of rows and columns in the grid
		self.rows = value.length;
		self.columns = value[0].length;
		
		// A JS reference to the item/solution that the grid was created from
		self.itemReference = itemReference;
		
		// Returns the orignal grid but with the rows and columns swapped
		self.getTranspose = function ()
		{
			// Generate a grid of zeros with opposite dimensions to this grid (rows => columns and columns => rows)
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

		// Returns the determinant of the matrix using Laplace decomposition
		self.getDeterminant = function ()
		{
			// Must be a square matrix otherwise the determinant is undefined
			if (self.getSquare() == false)
			{
				return false;
			}

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
				// Move along the first column, taking minor matrices
				var minor = self.getMinorMatrix(calculator_items.Scalar(row), calculator_items.Scalar(0));

				// The change in the value of the determinant total. Will be added on even rows, and subtracted on odd rows.
				var determinantChange = calculator_operations.multiply([self.value[row][0], minor.getDeterminant()]);

				// The first row, where determinant is undefined
				if (typeof determinant == 'undefined')
				{
					// If no determinant exists, create a new one from the first value calculated
					var determinant = determinantChange;

					// Must be on the first row (positive) so now change to a negative row
					positive = false;
				}
				else
				{
					if (positive)
					{
						// Add the minor determinant to the major determinant if we are on a positive row
						determinant = calculator_operations.add([determinant, determinantChange]);

						// Switch from positive to negative row
						positive = false;
					}
					else
					{
						// Otherwise, subtract the new value to the existing determinant if we are on a negative row
						determinant = calculator_operations.subtract([determinant, determinantChange]);

						// Switch from negative to positive row
						positive = true;
					}
				}

				// Continue to the next row in the matrix
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
			
			// If the amount of rows or columns of the matrix is 1 or less, the matrix of minors is undefined
			if (self.rows <= 1 || self.columns <= 1)
			{
				return false;
			}

			// Generate an identically sized matrix containing all zeros to hold the values of the matrix of minors
			var minors = calculator_logic.generateZeroGrid(self.rows, self.columns);

			var row = 0;
			while (row < self.rows)
			{
				var column = 0;
				while (column < self.columns)
				{
					// Gets the determinant of the minor matrix in that location, as a Scalar object
					minors.value[row][column] = self.getMinorMatrix(calculator_items.Scalar(row), calculator_items.Scalar(column)).getDeterminant();

					column += 1;
				}

				row += 1;
			}

			return minors;
		};

		// Returns the matrix of cofactors but where the sign (+ or -) or each element follows a checkerboard pattern
		self.getMatrixOfCofactors = function ()
		{
			// Get the matrix of minors for this matrix
			var minors = self.getMatrixOfMinors();

			// If the matrix of minors for a matrix is undefined, there is no matrix of cofactors
			if (minors == false)
			{
				return false;
			}

			// Multiplier value that will be either 1 or -1 depending on the location of the element
			var multiplier = calculator_items.Scalar(1);

			var row = 0;
			while (row < self.rows)
			{
				var column = 0;
				while (column < self.columns)
				{
					// Changes the sign of that element according to the checker board pattern
					minors.value[row][column] = calculator_operations.multiply([minors.value[row][column], multiplier]);

					// Changes the multiplier for the element to the left
					multiplier = calculator_operations.multiply([multiplier, calculator_items.Scalar(-1)]);
					column += 1;
				}

				// Changes the multiplier so that its starting value alternates every row
				multiplier = calculator_items.Scalar(Math.pow(-1, row + 1));
				row += 1;
			}

			return minors;
		};

		// Returns a matrix equal to the transpose of the matrix of cofactors, used in finding inverse matrices
		self.getAdjugate = function ()
		{
			// Get the cofactor matrix of this matrix
			var cofactors = self.getMatrixOfCofactors();

			// The adjugate of a matrix is undefined if there is no cofactor matrix
			if (cofactors == false)
			{
				return false;
			}

			// Get the transpose of the matrix of cofactors
			var adjugate = cofactors.getTranspose();

			return adjugate;
		};

		// Calculates the inverse of the original matrix
		// For the inverse, the following must hold true: original * inverse = identity
		self.getInverse = function ()
		{
			// Get the adjugate matrix of this matrix
			var adjugate = self.getAdjugate();

			// If no adjugate can be found, the matrix has no inverse
			if (adjugate == false)
			{
				return false;
			}

			// Get the determinant of this matrix
			var determinant = self.getDeterminant();

			// Inverse is undefined for zero determinant matrices (because of division by zero error)
			if (determinant.value == 0)
			{
				return false;
			}

			// Inverse is equal to: adjugate * 1/determinant
			var inverse = calculator_logic.scalarGridOperation(determinant, adjugate, calculator_operations.divide);

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
			// Creates a new scalar to hold the sum of this vectors components
			var sum = calculator_items.Scalar(0);

			// Loop throughy every component/element in the vector
			var r = 0;
			while (r < self.rows)
			{
				// Add together the square of every component in the vector
				var squareValue = calculator_operations.exponential([self.value[r][0], calculator_items.Scalar(2)]);
				sum = calculator_operations.add([sum, squareValue]);

				// Continue to the next component
				r += 1;
			}

			// Return the square root of the sum of components (pythagoras theorum)
			return calculator_operations.exponential([sum, calculator_items.Scalar(0.5)]);
		};

		// Returns a vector object, with the magnitude 1 in the same direction as this vector
		self.normalize = function ()
		{
			// Generate a new array to hold the normalised vector components
			var unitValue = new Array(self.rows);

			// Get the magnitude of this vector, to divide by
			var magnitude = self.getMagnitude();

			// Loop throughy every component in the vector
			var r = 0;
			while (r < self.rows)
			{
				// Divide this vector component by the magnitude to normalise it
				unitValue[r] = [self.value[r] / magnitude.value];

				// Continue to the next component
				r += 1;
			}

			// Return a new vector object with the correct unit vector values
			return calculator_items.Grid(unitValue);
		};

		return self;
	};
	
	return self;
}();