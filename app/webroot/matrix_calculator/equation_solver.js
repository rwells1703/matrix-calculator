class Scalar {
	constructor(value) {
		this.type = "Scalar";
		this.value = value;
	}
	
	display() {
		console.log(this.value);
	}
}

class Matrix {
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

class Function {
	constructor(type) {
		this.type = type;
	}
}

class Operator {
	constructor(type) {
		this.type = type;
	}
}

// Placeholder for functions and operators that have not been selected
class Empty {
	constructor() {
		this.type = "Empty";
	}
}

function solveEquation() {
	equation = parseItemValues();
	console.log(validateEquation(equation));
}

// Returns an array containing objects for each item in the equation
function parseItemValues() {
	// Returns a new array object for storing scalar, matrix, function and operator objects
	// Cannot use a fixed size array because each item uses a different amount of memory space and js does not support them natively
	var equation = new Array(scalarCount + matrixCount + functionCount + operatorCount);
	
	var i = 0;
	while (i < itemDiv.children.length) {
		var item = itemDiv.children[i];
		
		// Parse scalar item
		if (item.className == "scalar") {
			var textBox = item.getElementsByTagName("input")[0];
			equation[i] = new Scalar(textBox.value);
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
					values[r].push(textBoxes[r*7 + c].value);
					c += 1;
				}
				r += 1;
			}
			
			equation[i] = new Matrix(values);
		}
		
		// Parse function item
		else if (item.className == "function") {
			var functionValue = item.getAttribute("value");
			
			if (functionValue == "Tra") {
				equation[i] = new Function("Transpose");
			}
			else if (functionValue == "Det") {
				equation[i] = new Function("Determinant");
			}
			else if (functionValue == "Sin") {
				equation[i] = new Function("Sin");
			}
			else if (functionValue == "Cos") {
				equation[i] = new Function("Cos");
			}
			else if (functionValue == "Tan") {
				equation[i] = new Function("Tan");
			}
			else {
				equation[i] = new Empty();
			}
		}
		
		// Parse operator item
		else if (item.className == "operator") {
			var operatorValue = item.getAttribute("value");
			
			if (operatorValue == "+") {
				equation[i] = new Operator("Add");
			}
			else if (operatorValue == "-") {
				equation[i] = new Operator("Subtract");
			}
			else if (operatorValue == "·") {
				equation[i] = new Operator("DotProduct");
			}
			else if (operatorValue == "x") {
				equation[i] = new Operator("CrossProduct");
			}
			else if (operatorValue == "^") {
				equation[i] = new Operator("Exponential");
			}
			else if (operatorValue == "(") {
				equation[i] = new Operator("OpenBracket");
			}
			else if (operatorValue == ")") {
				equation[i] = new Operator("CloseBracket");
			}
			else {
				equation[i] = new Empty();
			}
		}
		
		i += 1;
	}
	
	return equation;
}

function validateEquation(equation) {
	var i = 0;
	unclosedBracketCount = 0;
	
	while (i < equation.length) {
		// Check that you are not applying a closed bracket after all brackets have already been closed
		if (equation[i].type == "CloseBracket") {
			if (unclosedBracketCount > 0) {
				unclosedBracketCount -= 1;
			}
			else {
				return ("No open bracket left to close at position "+i);
				//return i;
			}
		}
		
		// Check that the last item is valid
		if (i == equation.length - 1) {
			console.log(i, equation[i].type);
			
			if (["Transpose", "Determinant", "Sin", "Cos", "Tan", "Add", "Subtract", "DotProduct", "CrossProduct", "Exponential", "OpenBracket", "Empty"].includes(equation[i].type)) {
				// Returns the position of the invalid item in the equation
				return ("Invalid last item at position "+i);
				//return i;
			}
		}
		else {
			console.log(i, equation[i].type, i+1, equation[i+1].type);
			
			// Check that items are followed by other correct items
			if (equation[i].type == "Scalar") {
				if (["Scalar", "Matrix", "Transpose", "Determinant", "Sin", "Cos", "Tan", "CrossProduct", "OpenBracket", "Empty"].includes(equation[i+1].type)) {
					// Returns i+1 because it is the next item that is at fault, not the current item
					return i + 1;
				}
			}
			else if (equation[i].type == "Matrix") {
				if (["Scalar", "Matrix", "Transpose", "Determinant", "Sin", "Cos", "Tan", "OpenBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "Transpose") {
				if (["Scalar", "Determinant", "Sin", "Cos", "Tan", "Add", "Subtract", "Dot", "Cross", "Exponential", "OpenBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "Determinant") {
				if (["Scalar", "Determinant", "Trigonometry", "Add", "Subtract", "Dot", "Cross", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "Sin" || equation[i].type == "Cos" || equation[i].type == "Tan") {
				if (["Matrix", "Transpose", "DotProduct", "CrossProduct", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "Add" || equation[i].type == "Subtract") {
				if (["DotProduct", "CrossProduct", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "DotProduct") {
				if (["DotProduct", "CrossProduct", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "CrossProduct") {
				if (["Scalar", "Determinant", "Trigonometry", "DotProduct", "CrossProduct", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "Exponential") {
				if (["Matrix", "Transpose", "DotProduct", "CrossProduct", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
			else if (equation[i].type == "OpenBracket") {
				if (["Add", "Subtract", "DotProduct", "CrossProduct", "Exponential", "CloseBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
				else {
					unclosedBracketCount += 1;
				}
			}
			else if (equation[i].type == "CloseBracket") {
				if (["Scalar", "Matrix", "Transpose", "Determinant", "Trigonometry", "OpenBracket", "Empty"].includes(equation[i+1].type)) {
					return i + 1;
				}
			}
		}
		
		i += 1;
	}
	// The equation is valid so returns true
	return true;
}