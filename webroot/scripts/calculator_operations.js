// Declare namespace
calculator_operations = function ()
{
	var self = {};
	
	self.add = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(left, right, function (a, b) { return a + b });
		}
		// SM SV 
		else if (left.type == "Scalar" && right.type == "Matrix" || left.type == "Scalar" && right.type == "Vector")
		{
			return calculator_logic.scalarGridOperation(left, right, function (a, b) { return calculator_operations.add(a,b) });
		}
		// MS VS
		else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(right, left, function (a, b) { return calculator_operations.add(a,b) });
		}
		// MM VV
		else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Vector" && right.type == "Vector")
		{
			return calculator_logic.gridGridElementWiseOperation(left, right, function (a, b) { return calculator_operations.add(a,b) });
		}
		
		return false;
	};
	
	self.subtract = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(left, right, function (a, b) { return a - b });
		}
		// SM SV 
		else if (left.type == "Scalar" && right.type == "Matrix" || left.type == "Scalar" && right.type == "Vector")
		{
			return calculator_logic.scalarGridOperation(left, right, function (a, b) { return calculator_operations.subtract(a,b) });
		}
		// MS VS
		else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(right, left, function (a, b) { return calculator_operations.subtract(a,b) });
		}
		// MM VV
		else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Vector" && right.type == "Vector")
		{
			return calculator_logic.gridGridElementWiseOperation(left, right, function (a, b) { return calculator_operations.subtract(a,b) });
		}
		
		return false;
	};
	
	self.multiply = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(left, right, function (a, b) { return a * b });
		}
		// SM SV 
		else if (left.type == "Scalar" && right.type == "Matrix" || left.type == "Scalar" && right.type == "Vector")
		{
			return calculator_logic.scalarGridOperation(left, right, function (a, b) { return calculator_operations.multiply(a,b) });
		}
		// MS VS
		else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(right, left, function (a, b) { return calculator_operations.multiply(a,b) });
		}
		// MM MV
		else if (left.type == "Matrix" && right.type == "Matrix" || left.type == "Matrix" && right.type == "Vector")
		{
			return calculator_logic.gridGridProduct(left, right);
		}
		
		return false;
	};
	
	self.divide = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(left, right, function (a, b) { return a / b });
		}
		// MS VS
		else if (left.type == "Matrix" && right.type == "Scalar" || left.type == "Vector" && right.type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(right, left, function (a, b) { return calculator_operations.divide(a,b) });
		}
		
		return false;
	};
	
	self.exponential = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(left, right, function (a, b) { return a ** b });
		}
		// MS
		if (left.type == "Matrix" && right.type == "Scalar")
		{
			return calculator_logic.matrixExponent(left, right);
		}
		
		return false;
	};
	
	self.permutations = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.permutations(left, right);
		}
		
		return false;
	};
	
	self.combinations = function (left, right)
	{
		// SS
		if (left.type == "Scalar" && right.type == "Scalar")
		{
			return calculator_logic.combinations(left, right);
		}
		
		return false;
	};
	
	self.factorial = function (left)
	{
		// S
		if (left.type == "Scalar")
		{
			return calculator_logic.factorial(left);
		}
		
		return false;
	};
	
	self.sin = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.sin(right);
		}
		
		return false;
	};
	
	self.cos = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.cos(right);
		}
		
		return false;
	};
	
	self.tan = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.tan(right);
		}
		
		return false;
	};
	
	self.arcsin = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.arcsin(right);
		}
		
		return false;
	};
	
	self.arccos = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.arccos(right);
		}
		
		return false;
	};
	
	self.arctan = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.arctan(right);
		}
		
		return false;
	};
	
	self.log = function (argument, base)
	{
		// S
		if (argument.type == "Scalar" && base.type == "Scalar")
		{
			return calculator_logic.log(argument, base);
		}
		
		return false;
	};
	
	self.ln = function (right)
	{
		// S
		if (right.type == "Scalar")
		{
			return calculator_logic.ln(right);
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
	
	self.inverse = function (right)
	{
		// M
		if (right.type == "Matrix")
		{
			return right.getInverse();
		}
		
		return false;
	};
	
	self.dotProduct = function (left, right)
	{
		// VV
		if (left.type == "Vector" && right.type == "Vector")
		{
			return calculator_logic.dotProduct(left, right);
		}
		
		return false;
	};
	
	self.vectorVectorAngle = function(left, right)
	{
		// VV
		if (left.type == "Vector" && right.type == "Vector")
		{
			return calculator_logic.vectorVectorAngle(left, right);
		}
		
		return false;
	};
	
	self.magnitude = function(right)
	{
		// S
		if (right.type == "Scalar")
		{
			return right.getMagnitude();
		}
		
		// V
		else if (right.type == "Vector")
		{
			return right.getMagnitude();
		}
		
		return false;
	};
	
	self.crossProduct = function (left, right)
	{
		// VV
		if (left.type == "Vector" && right.type == "Vector")
		{
			return calculator_logic.normalVector([left, right]);
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
		
		return calculator_logic.normalVector(vectors);
	};

	return self;
}();