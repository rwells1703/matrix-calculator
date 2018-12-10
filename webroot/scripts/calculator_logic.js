// Declare namespace
calculator_logic = function ()
{
	var self = {};
	
	self.scalarScalarOperation = function (left, right, operation)
	{
		var value = operation([left.value, right.value]);
		
		return calculator_items.Scalar(value);
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
			return calculator_items.Scalar(1);
		}
		
		// General case, continue recursion for n - 1
		var value = calculator_operations.multiply([scalar, calculator_logic.factorial(calculator_items.Scalar(scalar.value - 1))]);
		
		return value;
	};
	
	self.permutations = function (n, r)
	{
		var numerator = calculator_logic.factorial(n);
		var denominator = calculator_logic.factorial(calculator_items.Scalar(n.value - r.value));
		
		return calculator_operations.divide([numerator, denominator]);
	};
	
	self.combinations = function (n, r)
	{
		var permutations = calculator_logic.permutations(n, r);
		var divisor = calculator_logic.factorial(r);
		
		return calculator_operations.divide([permutations, divisor]);
	};
	
	self.sin = function (scalar)
	{
		var inputValue = scalar.value;
		
		if (angleUnit == "Degrees")
		{
			inputValue *= Math.PI/180;
		}
		
		return calculator_items.Scalar(Math.sin(inputValue));
	};
	
	self.cos = function (scalar)
	{
		var inputValue = scalar.value;
		
		if (angleUnit == "Degrees")
		{
			inputValue *= Math.PI/180;
		}
		
		return calculator_items.Scalar(Math.cos(inputValue));
	};
	
	self.tan = function (scalar)
	{
		var inputValue = scalar.value;
		
		if (angleUnit == "Degrees")
		{
			inputValue *= Math.PI/180;
		}
		
		return calculator_items.Scalar(Math.tan(inputValue));
	};
	
	self.arcsin = function (scalar)
	{
		if (scalar.value < -1 || scalar.value > 1)
		{
			return false;
		}
		
		var angle = Math.asin(scalar.value);
		
		if (angleUnit == "Degrees")
		{
			angle *= 180/Math.PI;
		}
		
		return calculator_items.Scalar(angle);
	};
	
	self.arccos = function (scalar)
	{
		if (scalar.value < -1 || scalar.value > 1)
		{
			return false;
		}
		
		var angle = Math.acos(scalar.value);
		
		if (angleUnit == "Degrees")
		{
			angle *= 180/Math.PI;
		}
		
		return calculator_items.Scalar(angle);
	};
	
	self.arctan = function (scalar)
	{
		var angle = Math.atan(scalar.value);
		
		if (angleUnit == "Degrees")
		{
			angle *= 180/Math.PI;
		}
		
		return calculator_items.Scalar(angle);
	};
	
	self.log = function (base, scalar)
	{
		// Logs are undefined for negative numbers
		if (scalar.value < 0)
		{
			return false;
		}
		
		if (base == undefined)
		{
			var base = calculator_items.Scalar(10);
		}
		
		var numerator = Math.log(scalar.value);
		var denominator = Math.log(base.value);
		
		// "log base b of a" is equal to "log a / log b"
		return calculator_items.Scalar(numerator / denominator);
	};
	
	self.ln = function (scalar)
	{
		// Logs are undefined for negative numbers
		if (scalar.value < 0)
		{
			return false;
		}
		
		return calculator_items.Scalar(Math.log(scalar.value));
	};
	
	// Performs an operation involving a scalar, on every element of a grid (matrix or vector) e.g. multiplication or addition
	self.scalarGridOperation = function (scalar, grid, operation)
	{
		// Generate a new zero grid, the same size as the origial grid, that will hold the output
		var output = calculator_logic.generateZeroGrid(grid.rows, grid.columns);

		var r = 0;
		while (r < grid.rows)
		{
			var c = 0;
			while (c < grid.columns)
			{
				// Perform the operation on the specified input grid element and save it to the output grid
				output.value[r][c] = operation([grid.value[r][c], scalar]);
				
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
		var product = calculator_logic.generateZeroGrid(left.rows, right.columns);

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
					var additionValue = calculator_operations.multiply([left.value[left_row][shift], right.value[shift][right_column]]);
					product.value[left_row][right_column] = calculator_operations.add([product.value[left_row][right_column], additionValue]);
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
		var output = calculator_logic.generateZeroGrid(left.rows, left.columns);

		var r = 0;
		while (r < left.rows)
		{
			var c = 0;
			while (c < left.columns)
			{
				// Perform the operation on the specified input grid elements and save it to the output grid
				output.value[r][c] = operation([left.value[r][c], right.value[r][c]]);

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
				elements[r].push(calculator_items.Scalar(0));
				c += 1;
			}

			r += 1;
		}

		// Create a new grid object containing the zero grid values
		return calculator_items.Grid(elements);
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
					elements[r].push(calculator_items.Scalar(1));
				}
				else
				{
					// Otherwise set the value to 0
					elements[r].push(calculator_items.Scalar(0));
				}

				c += 1;
			}

			r += 1;
		}

		// Create a new matrix object containing the identity matrix values
		return calculator_items.Grid(elements);
	};
	
	// Multiplies a matrix by itself the corresponding number of times
	self.matrixExponent = function (matrix, scalar)
	{
		// Create zero grid to the same order as the matrix
		var output = matrix;
		
		var n = scalar.value - 1;
		while (n > 0)
		{
			output = calculator_logic.gridGridProduct(output, matrix);
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

		var total = calculator_items.Scalar(0);

		// Loop through each row (dimension) of the vectors
		var r = 0;
		while (r < left.rows)
		{
			// Multiply the vectors together in the same dimension, and add this value to the total
			var product = calculator_operations.multiply([left.value[r][0], right.value[r][0]]);
			total = calculator_operations.add([total, product]);
			r += 1;
		}

		return total;
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
		var matrix = calculator_logic.generateZeroGrid(len, len);
		
		// Gets a set of basis vectors to be inserted into the top row of the matrix
		var basisVectors = calculator_logic.generateBasisVectors(len);

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
	self.vectorVectorAngle = function (left, right)
	{
		var dotProduct = calculator_logic.dotProduct(left,right);
		var magnitudeProduct = calculator_operations.multiply([left.getMagnitude(), right.getMagnitude()]);
		
		if (magnitudeProduct.value == 0)
		{
			return false;
		}

		var cosineAngle = calculator_operations.divide([dotProduct, magnitudeProduct]);

		// Return the angle in the correct unit
		var angle = calculator_operations.arccos([cosineAngle]);

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
			var basisVector = calculator_logic.generateZeroGrid(dimensions, 1);
			// Assign the correct component of the vector a scalar value of 1
			basisVector.value[d] = [calculator_items.Scalar(1)];
			// Add the new basis vector to the array of basis vectors
			vectors.push(basisVector);

			d += 1;
		}

		return vectors;
	};

	return self;
}();