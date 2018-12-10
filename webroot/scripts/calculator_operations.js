// Declare namespace
calculator_operations = function ()
{
	var self = {};
	
	self.add = function (operands)
	{	
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(operands[0], operands[1], function (operands) { return operands[0] + operands[1] });
		}
		// SM SV 
		else if (operands[0].type == "Scalar" && operands[1].type == "Matrix" || operands[0].type == "Scalar" && operands[1].type == "Vector")
		{
			return calculator_logic.scalarGridOperation(operands[0], operands[1], function (operands) { return calculator_operations.add(operands) });
		}
		// MS VS
		else if (operands[0].type == "Matrix" && operands[1].type == "Scalar" || operands[0].type == "Vector" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(operands[1], operands[0], function (operands) { return calculator_operations.add(operands) });
		}
		// MM VV
		else if (operands[0].type == "Matrix" && operands[1].type == "Matrix" || operands[0].type == "Vector" && operands[1].type == "Vector")
		{
			return calculator_logic.gridGridElementWiseOperation(operands[0], operands[1], function (operands) { return calculator_operations.add(operands) });
		}
		
		return false;
	};
	
	self.subtract = function (operands)
	{	
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(operands[0], operands[1], function (operands) { return operands[0] - operands[1] });
		}
		// SM SV 
		else if (operands[0].type == "Scalar" && operands[1].type == "Matrix" || operands[0].type == "Scalar" && operands[1].type == "Vector")
		{
			return calculator_logic.scalarGridOperation(operands[0], operands[1], function (operands) { return calculator_operations.subtract(operands) });
		}
		// MS VS
		else if (operands[0].type == "Matrix" && operands[1].type == "Scalar" || operands[0].type == "Vector" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(operands[1], operands[0], function (operands) { return calculator_operations.subtract(operands) });
		}
		// MM VV
		else if (operands[0].type == "Matrix" && operands[1].type == "Matrix" || operands[0].type == "Vector" && operands[1].type == "Vector")
		{
			return calculator_logic.gridGridElementWiseOperation(operands[0], operands[1], function (operands) { return calculator_operations.subtract(operands) });
		}
		
		return false;
	};
	
	self.multiply = function (operands)
	{	
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(operands[0], operands[1], function (operands) { return operands[0] * operands[1] });
		}
		// SM SV 
		else if (operands[0].type == "Scalar" && operands[1].type == "Matrix" || operands[0].type == "Scalar" && operands[1].type == "Vector")
		{
			return calculator_logic.scalarGridOperation(operands[0], operands[1], function (operands) { return calculator_operations.multiply(operands) });
		}
		// MS VS
		else if (operands[0].type == "Matrix" && operands[1].type == "Scalar" || operands[0].type == "Vector" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(operands[1], operands[0], function (operands) { return calculator_operations.multiply(operands) });
		}
		// MM MV
		else if (operands[0].type == "Matrix" && operands[1].type == "Matrix" || operands[0].type == "Matrix" && operands[1].type == "Vector")
		{
			return calculator_logic.gridGridProduct(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.divide = function (operands)
	{
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(operands[0], operands[1], function (operands) { return operands[0] / operands[1] });
		}
		// MS VS
		else if (operands[0].type == "Matrix" && operands[1].type == "Scalar" || operands[0].type == "Vector" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarGridOperation(operands[1], operands[0], function (operands) { return calculator_operations.divide(operands) });
		}
		
		return false;
	};
	
	self.exponential = function (operands)
	{
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.scalarScalarOperation(operands[0], operands[1], function (operands) { return operands[0] ** operands[1] });
		}
		// MS
		if (operands[0].type == "Matrix" && operands[1].type == "Scalar")
		{
			return calculator_logic.matrixExponent(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.permutations = function (operands)
	{
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.permutations(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.combinations = function (operands)
	{
		// SS
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.combinations(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.factorial = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.factorial(operands[0]);
		}
		
		return false;
	};
	
	self.sin = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.sin(operands[0]);
		}
		
		return false;
	};
	
	self.cos = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.cos(operands[0]);
		}
		
		return false;
	};
	
	self.tan = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.tan(operands[0]);
		}
		
		return false;
	};
	
	self.arcsin = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.arcsin(operands[0]);
		}
		
		return false;
	};
	
	self.arccos = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.arccos(operands[0]);
		}
		
		return false;
	};
	
	self.arctan = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.arctan(operands[0]);
		}
		
		return false;
	};
	
	self.log = function (operands)
	{
		// S
		if (operands[0].type == "Scalar" && operands[1].type == "Scalar")
		{
			return calculator_logic.log(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.ln = function (operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return calculator_logic.ln(operands[0]);
		}
		
		return false;
	};
	
	self.transpose = function (operands)
	{
		// M V
		if (operands[0].type == "Matrix" || operands[0].type == "Vector")
		{
			return operands[0].getTranspose();
		}

		return false;
	};
	
	self.determinant = function (operands)
	{
		// M
		if (operands[0].type == "Matrix")
		{
			return operands[0].getDeterminant();
		}

		return false;
	};
	
	self.minor = function (operands)
	{
		// M
		if (operands[0].type == "Matrix" && operands[1].type == "Scalar" && operands[2].type == "Scalar")
		{
			return operands[0].getMinorMatrix(operands[1], operands[2]);
		}

		return false;
	};
	
	self.minors = function (operands)
	{
		// M
		if (operands[0].type == "Matrix")
		{
			return operands[0].getMatrixOfMinors();
		}

		return false;
	};
	
	self.cofactors = function (operands)
	{
		// M
		if (operands[0].type == "Matrix")
		{
			return operands[0].getMatrixOfCofactors();
		}
		
		return false;
	};
	
	self.adjugate = function (operands)
	{
		// M
		if (operands[0].type == "Matrix")
		{
			return operands[0].getAdjugate();
		}
		
		return false;
	};
	
	self.inverse = function (operands)
	{
		// M
		if (operands[0].type == "Matrix")
		{
			return operands[0].getInverse();
		}
		
		return false;
	};
	
	self.dotProduct = function (operands)
	{
		// VV
		if (operands[0].type == "Vector" && operands[1].type == "Vector")
		{
			return calculator_logic.dotProduct(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.vectorVectorAngle = function(operands)
	{
		// VV
		if (operands[0].type == "Vector" && operands[1].type == "Vector")
		{
			return calculator_logic.vectorVectorAngle(operands[0], operands[1]);
		}
		
		return false;
	};
	
	self.magnitude = function(operands)
	{
		// S
		if (operands[0].type == "Scalar")
		{
			return operands[0].getMagnitude();
		}
		
		// V
		else if (operands[0].type == "Vector")
		{
			return operands[0].getMagnitude();
		}
		
		return false;
	};
	
	self.crossProduct = function (operands)
	{
		// VV
		if (operands[0].type == "Vector" && operands[1].type == "Vector")
		{
			return calculator_logic.normalVector([operands[0], operands[1]]);
		}
		
		return false;
	};
	
	self.normalVector = function (operands)
	{
		// V VV VVV VVVV and so on...
		var i = 0;
		while (i < operands.length)
		{
			if (operands[i].type != "Vector")
			{
				return false;
			}
			
			i += 1;
		}
		
		return calculator_logic.normalVector(operands);
	};

	return self;
}();