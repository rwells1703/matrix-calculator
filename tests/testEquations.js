// Make i abbreviation of calculator_items to save space when defining tests
var i = calculator_items;

// Defines the tests
var testEquations = [
	[[i.Scalar(6),i.Operation('Add'),i.Scalar(2)], 'normal add'],
	[[i.Scalar(6),i.Operation('Subtract'),i.Scalar(2)], 'normal subtract'],
	[[i.Scalar(6),i.Operation('Multiply'),i.Scalar(2)], 'normal multiply'],
	[[i.Scalar(6),i.Operation('Divide'),i.Scalar(2)], 'normal divide'],

	[[i.Scalar(-3),i.Operation('Subtract'),i.Scalar(-11)], 'negative subtract'],
	[[i.Scalar(-4),i.Operation('Multiply'),i.Scalar(9)], 'negative multiply'],

	[[i.Scalar(0.3),i.Operation('Add'),i.Scalar(0.4)], 'add two decimals'],
	[[i.Scalar(0.3),i.Operation('Multiply'),i.Scalar(0.4)], 'multiply two decimals'],
	[[i.Scalar(1),i.Operation('Divide'),i.Scalar(3)], 'recurring decimal divide'],

	[[i.Scalar(0.0001),i.Operation('Multiply'),i.Scalar(123456)], 'small multiply by large'],
	[[i.Scalar(123456),i.Operation('Multiply'),i.Scalar(7891234)], 'large multiply by large'],

	[[i.Scalar(4),i.Operation('Divide'),i.Scalar(0)], 'divide by 0'],

	[[i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Operation('Multiply'),i.Scalar(3)], 'no brackets 1'],
	[[i.Bracket("("),i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Bracket(")"),i.Operation('Multiply'),i.Scalar(3)], '1 bracket 1'],
	[[i.Scalar(6),i.Operation('Divide'),i.Scalar(2),i.Operation('Exponential'),i.Scalar(3),i.Operation('Subtract'),i.Scalar(2)], 'no brackets 2'],
	[[i.Bracket("("),i.Scalar(6),i.Operation('Divide'),i.Scalar(2),i.Bracket(")"),i.Operation('Exponential'),i.Bracket("("),i.Scalar(3),i.Operation('Subtract'),i.Scalar(2),i.Bracket(")")], '2 brackets 2'],
	[[i.Scalar(2),i.Operation('Add'),i.Scalar(3),i.Operation('Multiply'),i.Scalar(5),i.Operation('Add'),i.Scalar(4)], 'no brackets 3'],
	[[i.Bracket("("),i.Bracket("("),i.Scalar(2),i.Operation('Add'),i.Scalar(3),i.Bracket(")"),i.Operation('Multiply'),i.Scalar(5),i.Bracket(")"),i.Operation('Add'),i.Scalar(4)], '2 nested brackets 3'],
	[[i.Bracket("("),i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Operation('Multiply'),i.Scalar(3)], 'no closing bracket'],
	[[i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Bracket(")"),i.Operation('Multiply'),i.Scalar(3)], 'no opening bracket'],

	[[i.Operation('Sin'),i.Scalar(0)], 'sin 0'],
	[[i.Operation('Sin'),i.Scalar(Math.PI/2)], 'sin pi/2'],
	[[i.Operation('Sin'),i.Scalar(Math.PI)], 'sin pi'],
	[[i.Operation('Cos'),i.Scalar(0)], 'cos 0'],
	[[i.Operation('Cos'),i.Scalar(Math.PI/2)], 'cos pi/2'],
	[[i.Operation('Cos'),i.Scalar(Math.PI)], 'cos pi'],
	[[i.Operation('Tan'),i.Scalar(0)], 'tan 0'],
	[[i.Operation('Tan'),i.Scalar(Math.PI/2)], 'tan pi/2'],
	[[i.Operation('Tan'),i.Scalar(Math.PI)], 'tan pi'],

	[[i.Operation('Arcsin'),i.Scalar(0)], 'arcsin 0'],
	[[i.Operation('Arcsin'),i.Scalar(1)], 'arcsin 1'],
	[[i.Operation('Arccos'),i.Scalar(0)], 'arccos 0'],
	[[i.Operation('Arccos'),i.Scalar(1)], 'arccos 1'],
	[[i.Operation('Arctan'),i.Scalar(0)], 'arctan 0'],
	[[i.Operation('Arctan'),i.Scalar(1)], 'arctan 1'],

	[[i.Scalar(5),i.Operation('Combinations'),i.Scalar(2)], 'n > r combinations'],
	[[i.Scalar(3),i.Operation('Combinations'),i.Scalar(3)], 'n = r combinations'],
	[[i.Scalar(1),i.Operation('Combinations'),i.Scalar(4)], 'n < r combinations'],
	[[i.Scalar(2),i.Operation('Combinations'),i.Scalar(0)], 'r = 0 combinations'],
	[[i.Scalar(-2),i.Operation('Combinations'),i.Scalar(3)], 'n negative combinations'],
	[[i.Scalar(3),i.Operation('Combinations'),i.Scalar(-2)], 'r negative combinations'],

	[[i.Scalar(5),i.Operation('Permutations'),i.Scalar(2)], 'n > r permutations'],
	[[i.Scalar(3),i.Operation('Permutations'),i.Scalar(3)], 'n = r permutations'],
	[[i.Scalar(1),i.Operation('Permutations'),i.Scalar(4)], 'n < r permutations'],
	[[i.Scalar(2),i.Operation('Permutations'),i.Scalar(0)], 'r = 0 permutations'],
	[[i.Scalar(-2),i.Operation('Permutations'),i.Scalar(3)], 'n negative permutations'],
	[[i.Scalar(3),i.Operation('Permutations'),i.Scalar(-2)], 'r negative permutations'],

	[[i.Scalar(5),i.Operation('Factorial')], 'normal factorial'],
	[[i.Scalar(0),i.Operation('Factorial')], '0 factorial'],
	[[i.Scalar(2.6),i.Operation('Factorial')], 'decimal factorial'],
	[[i.Scalar(-3),i.Operation('Factorial')], 'negative factorial'],

	[[i.Operation('Log'), i.Scalar(10), i.Scalar(23)], 'log base 10 normal'],
	[[i.Operation('Log'), i.Scalar(10), i.Scalar(10)], 'log base 10 of 10'],
	[[i.Operation('Log'), i.Scalar(0), i.Scalar(5)], 'log base 0'],
	[[i.Operation('Log'), i.Scalar(-3), i.Scalar(5)], 'log base negative'],
	[[i.Operation('Log'), i.Scalar(10), i.Scalar(-4)], 'log base 2 negative'],
	[[i.Operation('Log'), i.Scalar(1000), i.Scalar(10)], 'log number < base'],

	[[i.Operation('Ln'), i.Scalar(23)], 'ln normal'],
	[[i.Operation('Ln'), i.Scalar(Math.E)], 'ln e'],
	[[i.Operation('Ln'), i.Scalar(0)], 'ln 0'],
	[[i.Operation('Ln'), i.Scalar(-3)], 'ln negative'],

	[[i.Scalar(2),i.Operation('Add'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar add matrix'],
	[[i.Scalar(2),i.Operation('Subtract'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar subtract matrix'],
	[[i.Scalar(2),i.Operation('Multiply'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar multiply matrix'],

	[[i.Scalar(2),i.Operation('Divide'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar divide matrix'],
	[[i.Scalar(2),i.Operation('Sin'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar sin function matrix'],
	[[i.Scalar(2),i.Operation('Exponential'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar exponential matrix'],
	[[i.Scalar(2),i.Operation('Combinations'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'scalar combinations matrix'],

	[[i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]]), i.Operation('Exponential'), i.Scalar(2)], 'square matrix exponential scalar'],
	[[i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(2)],[i.Scalar(6),i.Scalar(5),i.Scalar(4)]]), i.Operation('Exponential'), i.Scalar(2)], 'non-square matrix exponential scalar'],
	[[i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]]), i.Operation('Exponential'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'matrix exponential matrix'],

	[[i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]]), i.Operation('Factorial')], 'matrix factorial'],

	[[i.Operation('Determinant'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'square matrix determinant'],
	[[i.Operation('Transpose'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'square matrix transpose'],
	[[i.Operation('Minors'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'square matrix minors'],
	[[i.Operation('Cofactors'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'square matrix cofactors'],
	[[i.Operation('Adjugate'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'square matrix adjugate'],
	[[i.Operation('Inverse'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], 'square matrix inverse'],

	[[i.Operation('Determinant'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], 'non-square matrix determinant'],
	[[i.Operation('Transpose'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], 'non-square matrix transpose'],
	[[i.Operation('Minors'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], 'non-square matrix minors'],
	[[i.Operation('Cofactors'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], 'non-square matrix cofactors'],
	[[i.Operation('Adjugate'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], 'non-square matrix adjugate'],
	[[i.Operation('Inverse'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], 'non-square matrix inverse'],

	[[i.Operation('Determinant'), i.Grid([[i.Scalar(4)]])], '1x1 matrix determinant'],
	[[i.Operation('Transpose'), i.Grid([[i.Scalar(4)]])], '1x1 matrix transpose'],
	[[i.Operation('Minors'), i.Grid([[i.Scalar(4)]])], '1x1 matrix minors'],
	[[i.Operation('Cofactors'), i.Grid([[i.Scalar(4)]])], '1x1 matrix cofactors'],
	[[i.Operation('Adjugate'), i.Grid([[i.Scalar(4)]])], '1x1 matrix adjugate'],
	[[i.Operation('Inverse'), i.Grid([[i.Scalar(4)]])], '1x1 matrix inverse'],

	[[i.Operation('Minor'), i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(4)],[i.Scalar(6),i.Scalar(3),i.Scalar(5)],[i.Scalar(0),i.Scalar(7),i.Scalar(2)]]), i.Scalar(1), i.Scalar(1)], 'normal minor matrix'],
	[[i.Operation('Minor'), i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(4)],[i.Scalar(6),i.Scalar(3),i.Scalar(5)],[i.Scalar(0),i.Scalar(7),i.Scalar(2)]]), i.Scalar(-2), i.Scalar(-4)], 'below bounds minor matrix'],
	[[i.Operation('Minor'), i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(4)],[i.Scalar(6),i.Scalar(3),i.Scalar(5)],[i.Scalar(0),i.Scalar(7),i.Scalar(2)]]), i.Scalar(4), i.Scalar(5)], 'above bounds minor matrix'],

	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Dot Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)]])], '2 dimension dot product'],
	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Operation('Dot Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], '3 dimension dot product'],
	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Dot Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], '2 by 3 dimension dot product'],

	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)]])], '2 dimension cross product'],
	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], '3 dimension cross product'],
	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], '2 by 3 dimension cross product'],
	[[i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]])], 'same vectors cross product'],

	[[i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Bracket("]")], 'normal vector from 2d vector'],
	[[i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Grid([[i.Scalar(1)],[i.Scalar(2)]]), i.Bracket("]")], 'normal vector from 2d and 2d vector'],
	[[i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(9)]]), i.Bracket("]")], 'normal vector from 3d and 3d vectors'],
	[[i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]]), i.Bracket("]")], 'normal vector from 2d and 3d vectors']
];

// Performs the tests
var n = 0;
while (n < testEquations.length) {
	// Get the input equation
	var equation = testEquations[n][0];

	try {
		// Attempt to solve the equation
		var solution = calculator_solve.solveEquation(equation);
	}
	// If an error is thrown, log this in the console
	catch(err) {
		var solution = "Error thrown: " + err
	}

	// Log the output of the test to the console
	console.log("Test " + (n+1) + " - " +  testEquations[n][1]);

	console.log("Equation:");
	console.log(equation);

	console.log("Solution:");
	console.log(solution);

	console.log("");

	// Move on to the next test
	n += 1;
}