// Declare namespace
calculator_equation_solver = {};

(function(context) {
	var replaceArraySection = function(array, start, end, replacement) {
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	}
    
    context.specialOperations = (function(self) {
        self.dotProduct = function(left, right) {
            if (left.type != "Vector" || right.type != "Vector") {
				return false
			}

			if (left.rows != right.rows) {
				return false
			}
			
			var total = 0;

			var r = 0;
			while (r < left.rows) {
				total += left.value[r][0] * right.value[r][0];
				r += 1;
			}

			return total;
        };

        self.generateZeroMatrix = function(rows, columns) {
            var elements = [];

            var r = 0;
            while (r < rows) {
                elements.push([]);
                var c = 0;
                while (c < columns) {
                    elements[r].push(0);
                    c += 1;
                }
                r += 1;
            }

            return context.Matrix(elements);
        };

        self.generateIdentityMatrix = function(size) {
            var elements = [];

            var r = 0;
            while (r < size ) {
                elements.push([]);
                var c = 0;
                while (c < size) {
                    if (r == c) {
                        elements[r].push(1);
                    }
                    else {
                        elements[r].push(0);
                    }
                    c += 1;
                }
                r += 1;
            }

            return context.Matrix(elements);
        };

        
        self.matrixMatrixProduct = function(left, right) {
            if (left.type != "Matrix" && right.type != "Matrix") {
                return false;
            }

            if (left.columns != right.rows) {
                return false;
            }

            var product = context.specialOperations.generateZeroMatrix(left.rows, right.columns);
            var left_row = 0;
            while (left_row < left.rows) {
                var right_column = 0;
                while (right_column < right.columns) {
                    var shift = 0;
                    while (shift < left.columns) {
                        product.value[left_row][right_column] += left.value[left_row][shift] * right.value[shift][right_column];
                        shift += 1;
                    }
                    right_column += 1;
                }
                left_row += 1;
            }

            return product;
        };

        self.scalarMatrixProduct = function(scalar, matrix) {
            if (scalar.type != "Scalar" && matrix.type != "Matrix") {
                return false;
            }

            var r = 0;
            while (r < matrix.rows) {
                var c = 0;
                while (c < matrix.columns) {
                        matrix.value[r][c] *= scalar;
                    c += 1;
                }
                r += 1;
            }

            return matrix;
        };

        return self;
	})({});

	context.Scalar = function(value) {
		var self = {};
		
		self.type = "Scalar";
		self.value = value;
	    
		self.display = function() {
			console.log(self.value);
		};
		
		return self;
	};
	
	context.Matrix = function(value) {
		var self = {};

		self.type = "Matrix";
		self.value = value;
		self.rows = value.length;
		self.columns = value[0].length;
	
		self.display = function() {
			var r = 0;
			while (r < self.rows) {
				var c = 0;
				while (c < self.columns) {
					console.log(self.value[r][c]);
					c += 1;
				}
				r += 1;
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
		while (i < itemDiv.children.length) {
			var item = itemDiv.children[i];
			
			// Parse scalar item
			if (item.className == "scalar") {
				var textBox = item.getElementsByTagName("input")[0];
				equation[i] = context.Scalar(parseFloat(textBox.value));
			}
			
			// Parse matrix item
			else if (item.className == "matrix") {
				var textBoxes = item.getElementsByTagName("input");
				
				var rows = item.getAttribute("rows");
				var columns = item.getAttribute("columns");
				
				var values = [];
				
				var r = 0;
				while (r < rows) {
					// Add new row
					values.push([]);
					
					var c = 0;
					while (c < columns) {
						// Add new item to the row
						values[r].push(parseFloat(textBoxes[r*7 + c].value));
						c += 1;
					}
					r += 1;
				}
				
				equation[i] = context.Matrix(values);
			}
			
			// Parse function item
			else if (item.className == "function") {
				var functionValue = item.getAttribute("value");
				
				if (functionValue == "Tra") {
					equation[i] = context.Function("Transpose");
				}
				else if (functionValue == "Det") {
					equation[i] =  context.Function("Determinant");
				}
				else if (functionValue == "Sin") {
					equation[i] = context.Function("Sin");
				}
				else if (functionValue == "Cos") {
					equation[i] = context.Function("Cos");
				}
				else if (functionValue == "Tan") {
					equation[i] = context.Function("Tan");
				}
				else {
					return false;
				}
			}
			
			// Parse operator item
			else if (item.className == "operator") {
				var operatorValue = item.getAttribute("value");
				
				if (operatorValue == "+") {
					equation[i] = context.Operator("Add");
				}
				else if (operatorValue == "-") {
					equation[i] = context.Operator("Subtract");
				}
				else if (operatorValue == "*") {
					equation[i] = context.Operator("Multiply");
				}
				else if (operatorValue == "/") {
					equation[i] = context.Operator("Divide");
				}
				else if (operatorValue == "^") {
					equation[i] = context.Operator("Exponential");
				}
				else if (operatorValue == "·") {
					equation[i] = context.Operator("DotProduct");
				}
				else if (operatorValue == "x") {
					equation[i] = context.Operator("CrossProduct");
				}
				else if (operatorValue == "(") {
					equation[i] = context.Operator("OpenBracket");
				}
				else if (operatorValue == ")") {
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

	context.solve = function() {
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
		var x = context.Matrix([[2,3],[5,2]]);
        var y = context.Matrix([[2,3],[5,2]]);
		//var y = context.Vector([[1],[3],[4]]);
		console.log(context.specialOperations.matrixMatrixProduct(x,y));
	}
	
	context.solveEquation = function(equation) {
		// BRACKETS
		// Counter and location of brackets
		var unclosedBrackets = 0;
		var openBracketLocation = -1;

		// Continues recursion inside brackets if necessary
		var i = 0;
		while (i < equation.length) {
			if (equation[i] == "(") {
				if (unclosedBrackets == 0) {
					openBracketLocation = i;
				}
				unclosedBrackets += 1;
			}
			else if (equation[i] == ")") {
				if (openBracketLocation == -1) {
					console.log("ERR: Bracket closed where there was no open bracket");
					return false;
				}
				
				unclosedBrackets -= 1;
				if (unclosedBrackets == 0) {
					var bracketSolution = context.solveEquation(equation.slice(openBracketLocation + 1, i));
					if (bracketSolution == false) {
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
		while (i > 0) {
			if (equation[i].value == "Exponential") {
				var value = Math.pow(equation[i-1].value, equation[i+1].value);
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			i -= 1;
		}
		
		// DIVISION AND MULTIPLICATION
		var i = 1;
		while (i < equation.length - 1) {
			if (equation[i].value == "Divide") {
				var value = equation[i-1].value / equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else if (equation[i].value == "Multiply") {
				var value = equation[i-1].value * equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else {
				i += 1;
			}
		}
		
		// ADDITION AND SUBTRACTION
		var i = 1;
		while (i < equation.length - 1) {
			if (equation[i].value == "Add") {
				var value = equation[i-1].value + equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else if (equation[i].value == "Subtract") {
				var value = equation[i-1].value - equation[i+1].value;
				var solution = context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else {
				i += 1;
			}
		}
		
		return equation;
	}
})(calculator_equation_solver);