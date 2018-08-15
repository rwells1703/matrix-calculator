class Scalar {
	constructor(value) {
		this.value = value;
	}
	
	display() {
		console.log(this.value);
	}
}

class Matrix {
	constructor(value) {
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

class Operator {
	constructor(value) {
		this.value = value;
	}
}

function solveEquation() {
	var equation = parseItemValues();
	
	/*var i = 0;
	while (i < equation.length) {
		console.log(equation[i]);
		i += 1;
	}*/
	
	console.log(validateEquation(equation));
}

// Returns an array containing objects for each item in the equation
function parseItemValues() {
	// Returns a new array object for storing scalar, matrix and operator objects
	// Cannot use a fixed size array because each item uses a different amount of memory space and js does not support them natively
	var equation = new Array(scalarCount+matrixCount+operatorCount);
	
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
		
		// Parse operator item
		else {
			equation[i] = new Operator(item.getAttribute("operator"));
		}
		i += 1;
	}
	
	return equation;
}

function validateEquation(equation) {
	var i = 0;
	var previousItemClass = "";
	while (i < equation.length) {
		var currentItemClass = equation[i].constructor.name;
		console.log(currentItemClass, previousItemClass);
		// Checks to make sure it alternates between matrix/scalar and operator
		if ((currentItemClass == "Matrix" && previousItemClass == "Matrix") || (currentItemClass == "Scalar" && previousItemClass == "Matrix") || (currentItemClass == "Matrix" && previousItemClass == "Scalar") || (currentItemClass == "Scalar" && previousItemClass == "Scalar")) {
			return false;
		}
		var previousItemClass = equation[i].constructor.name;
		i += 1;
	}
	return true;
}