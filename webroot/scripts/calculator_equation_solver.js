// Declare namespace
calculator_equation_solver = {};

(function(context) {
	context.Scalar = class {
		constructor(value) {
			this.type = "Scalar";
			this.value = value;
		}
		
		display() {
			console.log(this.value);
		}
	}

	context.Matrix = class {
		constructor(value) {
			this.type = "Matrix";
			this.value = value;
			this.rows = value.length;
			this.columns = value[0].length;
		}
		
		display() {
			var r = 0;
			while (r < this.rows) {
				var c = 0;
				while (c < this.columns) {
					console.log(this.value[r][c]);
					c += 1;
				}
				r += 1;
			}
		}
	}

	context.Function = class {
		constructor(type) {
			this.type = type;
		}
	}

	context.Operator = class {
		constructor(type) {
			this.type = type;
		}
	}

	// Placeholder for functions and operators that have not been selected
	context.Empty = class {
		constructor() {
			this.type = "Empty";
		}
	}

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
				equation[i] = new context.Scalar(parseFloat(textBox.value));
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
				
				equation[i] = new context.Matrix(values);
			}
			
			// Parse function item
			else if (item.className == "function") {
				var functionValue = item.getAttribute("value");
				
				if (functionValue == "Tra") {
					equation[i] = new context.Function("Transpose");
				}
				else if (functionValue == "Det") {
					equation[i] = new context.Function("Determinant");
				}
				else if (functionValue == "Sin") {
					equation[i] = new context.Function("Sin");
				}
				else if (functionValue == "Cos") {
					equation[i] = new context.Function("Cos");
				}
				else if (functionValue == "Tan") {
					equation[i] = new context.Function("Tan");
				}
				else {
					equation[i] = new context.Empty();
				}
			}
			
			// Parse operator item
			else if (item.className == "operator") {
				var operatorValue = item.getAttribute("value");
				
				if (operatorValue == "+") {
					equation[i] = new context.Operator("Add");
				}
				else if (operatorValue == "-") {
					equation[i] = new context.Operator("Subtract");
				}
				else if (operatorValue == "·") {
					equation[i] = new context.Operator("DotProduct");
				}
				else if (operatorValue == "x") {
					equation[i] = new context.Operator("CrossProduct");
				}
				else if (operatorValue == "^") {
					equation[i] = new context.Operator("Exponential");
				}
				else if (operatorValue == "(") {
					equation[i] = new context.Operator("OpenBracket");
				}
				else if (operatorValue == ")") {
					equation[i] = new context.Operator("CloseBracket");
				}
				else {
					equation[i] = new context.Empty();
				}
			}
			
			i += 1;
		}
		
		return equation;
	}

	context.solve = function() {
		//var equation = [new context.Scalar(24), new context.Operator("Divide"), new context.Scalar(8), new context.Operator("Indice"), new context.Scalar(2)];
		//var equation = [new context.Scalar(2), new context.Operator("Multiply"), "(", new context.Scalar(3), new context.Operator("Add"), new context.Scalar(5), ")", new context.Operator("Mulitply"), new context.Scalar(0.5)];
		//var equation = ["(", new context.Scalar(3), new context.Operator("Indice"), new context.Scalar(2), ")", new context.Operator("Indice"), new context.Scalar(3)];
		var equation = [new context.Scalar(8), new context.Operator("Subtract"), "(", "(", new context.Scalar(8), new context.Operator("Add"), new context.Scalar(8), ")", new context.Operator("Exponent"), "(", new context.Scalar(1), new context.Operator("Divide"), new context.Scalar(2), ")", ")", new context.Operator("Exponent"), "(", new context.Scalar(1), new context.Operator("Divide"), new context.Scalar(2), ")"];
		
		console.log(equation);
		console.log(context.solveEquation(equation));
	}

	var replaceArraySection = function(array, start, end, replacement) {
		return array.slice(0, start).concat(replacement).concat(array.slice(end + 1, array.length));
	}

	/*
	// HALF WAY THROUGH MOVING THE NESTED FUNCTIONS INTO OUTER PRIVATE FUNCTIONS HOWEVER THERE IS A PROBLEM WITH THE PARENT NAMESPACING
	var evaluateIndice = function(left, right) {
		if (left.type != "Scalar") {
			console.log("ERR: Element before indice operator is not valid");
			return false;
		}

		if (right.type != "Scalar") {
			console.log("ERR: Element after indice operator is not valid");
			return false;
		}

		var solution = new context.Scalar(Math.pow(left.value, right.value));
        return solution;
	}

    var evaluateMultiply = function(left, right) {
		if (left.type != "Scalar") {
			console.log("ERR: Element before indice operator is not valid");
			return false;
		}

		if (right.type != "Scalar") {
			console.log("ERR: Element after indice operator is not valid");
			return false;
		}
		
		var solution = new context.Scalar(left.value * right.value);
        return solution;
	}
	
    var evaluateDivide = function(left, right) {
		if (left.type != "Scalar") {
			console.log("ERR: Element before indice operator is not valid");
			return false;
		}

		if (right.type != "Scalar") {
			console.log("ERR: Element after indice operator is not valid");
			return false;
		}

		var solution = new context.Scalar(left.value / right.value);
		return solution;
	}

    var evaluateAdd = function(left, right) {
		if (left.type != "Scalar") {
			console.log("ERR: Element before indice operator is not valid");
			return false;
		}

		if (right.type != "Scalar") {
			console.log("ERR: Element after indice operator is not valid");
			return false;
		}

		var solution = new context.Scalar(left.value + right.value);
		return solution;
	}
	
	var evaluateSubtract = function(left, right) {
		if (left.type != "Scalar") {
			console.log("ERR: Element before indice operator is not valid");
			return false;
		}

		if (right.type != "Scalar") {
			console.log("ERR: Element after indice operator is not valid");
			return false;
		}

		var solution = new context.Scalar(left.value - right.value);
		return solution;
	}

	var evaluateGeneralOperator = function(left, right, equationOperator, currentOperator) {
		if (equationOperator.type == currentOperator[0]) {
			var solution = currentOperator[1](left, right);
			return solution;
		}
		return false;
	}

	var evaluateBrackets = function(equation) {
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

		return equation;
	}
	*/
	
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
		
		// EXPONENTS
		var i = equation.length - 2;
		while (i > 0) {
			if (equation[i].type == "Exponent") {
				var value = Math.pow(equation[i-1].value, equation[i+1].value);
				var solution = new context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			i -= 1;
		}
		
		// DIVISION AND MULTIPLICATION
		var i = 1;
		while (i < equation.length - 1) {
			if (equation[i].type == "Divide") {
				var value = equation[i-1].value / equation[i+1].value;
				var solution = new context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else if (equation[i].type == "Multiply") {
				var value = equation[i-1].value * equation[i+1].value;
				var solution = new context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			i += 1;
		}
		
		// ADDITION AND SUBTRACTION
		var i = 1;
		while (i < equation.length - 1) {
			if (equation[i].type == "Add") {
				var value = equation[i-1].value + equation[i+1].value;
				var solution = new context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			else if (equation[i].type == "Subtract") {
				var value = equation[i-1].value - equation[i+1].value;
				var solution = new context.Scalar(value);
				equation = replaceArraySection(equation, i-1, i+1, solution);
			}
			i += 1;
		}
		
		return equation;
	}
	
	/*
	context.solveEquation = function(equation) {
		equation = evaluateBrackets(equation);

		var operators = [["Indice", evaluateIndice, "b"], ["Divide", evaluateDivide, "f"], ["Multiply", evaluateMultiply, "f"], ["Add", evaluateAdd, "f"], ["Subtract", evaluateSubtract, "f"]];

		var i = 0;
		// Loop through each operator in order of bodmas
		while (i < operators.length) {
			if (operators[i][2] == "f") {
				// Starts on the item after the first
				var j = 1;

				// Loop through each item in the equation forwards
				while (j < equation.length - 1) {
					var solution = evaluateGeneralOperator(equation[j-1], equation[j+1], equation[j], operators[i]);
					if (solution != false) {					
						equation = replaceArraySection(equation, j-1, j+1, solution);
					}

					j += 1;
				}
			}

			else if (operators[i][2] == "b") {
				// Starts on item before the last
				var j = equation.length - 2;

				// Loop through each item in the equation backwards
				while (j > 0) {
					var solution = evaluateGeneralOperator(equation[j-1], equation[j+1], equation[j], operators[i]);
					if (solution != false) {					
						equation = replaceArraySection(equation, j-1, j+1, solution);
					}

					j -= 1;
				}
			}

			i += 1;
		}

		
		return equation;
	}
	*/
	
})(calculator_equation_solver);