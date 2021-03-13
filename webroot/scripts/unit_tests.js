// Declare namespace
unit_tests = function ()
{
	var self = {};

	// Make i abbreviation of calculator_items to save space when defining tests
	var i = calculator_items;

	// Defines the unit tests to be run
	var testEquations = [
		// Tests are defined in the following form:
		// [name, equation input, expected output, {optional 'debug' string that halts execution when this test is run}]

		['normal add', [i.Scalar(6),i.Operation('Add'),i.Scalar(2)], [i.Scalar(8)]],
		['normal subtract', [i.Scalar(6),i.Operation('Subtract'),i.Scalar(2)], [i.Scalar(4)]],
		['normal multiply', [i.Scalar(6),i.Operation('Multiply'),i.Scalar(2)], [i.Scalar(12)]],
		['normal divide', [i.Scalar(6),i.Operation('Divide'),i.Scalar(2)], [i.Scalar(3)]],

		['negative subtract', [i.Scalar(-3),i.Operation('Subtract'),i.Scalar(-11)], [i.Scalar(8)]],
		['negative multiply', [i.Scalar(-4),i.Operation('Multiply'),i.Scalar(9)], [i.Scalar(-36)]],

		['add two decimals', [i.Scalar(0.3),i.Operation('Add'),i.Scalar(0.4)], [i.Scalar(0.7)]],
		['multiply two decimals', [i.Scalar(0.3),i.Operation('Multiply'),i.Scalar(0.4)], [i.Scalar(0.12)]],
		['recurring decimal divide', [i.Scalar(1),i.Operation('Divide'),i.Scalar(3)], [i.Scalar(0.33333333333333333333333)]],

		['small multiply by large', [i.Scalar(0.0001),i.Operation('Multiply'),i.Scalar(123456)], [i.Scalar(12.3456)]],
		['large multiply by large', [i.Scalar(123456),i.Operation('Multiply'),i.Scalar(7891234)], [i.Scalar(974220184704)]],

		['divide by 0', [i.Scalar(4),i.Operation('Divide'),i.Scalar(0)], false],

		['no brackets 1', [i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Operation('Multiply'),i.Scalar(3)], [i.Scalar(12)]],
		['1 bracket 1', [i.Bracket("("),i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Bracket(")"),i.Operation('Multiply'),i.Scalar(3)], [i.Scalar(24)]],
		['no brackets 2', [i.Scalar(6),i.Operation('Divide'),i.Scalar(2),i.Operation('Exponential'),i.Scalar(3),i.Operation('Subtract'),i.Scalar(2)], [i.Scalar(-1.25)]],
		['2 brackets 2', [i.Bracket("("),i.Scalar(6),i.Operation('Divide'),i.Scalar(2),i.Bracket(")"),i.Operation('Exponential'),i.Bracket("("),i.Scalar(3),i.Operation('Subtract'),i.Scalar(2),i.Bracket(")")], [i.Scalar(3)]],
		['no brackets 3', [i.Scalar(2),i.Operation('Add'),i.Scalar(3),i.Operation('Multiply'),i.Scalar(5),i.Operation('Add'),i.Scalar(4)], [i.Scalar(21)]],
		['2 nested brackets 3', [i.Bracket("("),i.Bracket("("),i.Scalar(2),i.Operation('Add'),i.Scalar(3),i.Bracket(")"),i.Operation('Multiply'),i.Scalar(5),i.Bracket(")"),i.Operation('Add'),i.Scalar(4)], [i.Scalar(29)]],
		['no closing bracket', [i.Bracket("("),i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Operation('Multiply'),i.Scalar(3)], false],
		['no opening bracket', [i.Scalar(6),i.Operation('Add'),i.Scalar(2),i.Bracket(")"),i.Operation('Multiply'),i.Scalar(3)], false],
		
		['sin 0', [i.Operation('Sin'),i.Scalar(0)], [i.Scalar(0)]],
		['sin pi/2', [i.Operation('Sin'),i.Scalar(Math.PI/2)], [i.Scalar(1)]],
		['sin pi', [i.Operation('Sin'),i.Scalar(Math.PI)], [i.Scalar(0)]],
		['cos 0', [i.Operation('Cos'),i.Scalar(0)], [i.Scalar(1)]],
		['cos pi/2', [i.Operation('Cos'),i.Scalar(Math.PI/2)], [i.Scalar(0)]],
		['cos pi', [i.Operation('Cos'),i.Scalar(Math.PI)], [i.Scalar(-1)]],
		['tan 0', [i.Operation('Tan'),i.Scalar(0)], [i.Scalar(0)]],
		['tan pi/2', [i.Operation('Tan'),i.Scalar(Math.PI/2)], false],
		['tan pi', [i.Operation('Tan'),i.Scalar(Math.PI)], [i.Scalar(0)]],

		['arcsin 0', [i.Operation('Arcsin'),i.Scalar(0)], [i.Scalar(0)]],
		['arcsin 1', [i.Operation('Arcsin'),i.Scalar(1)], [i.Scalar(1.570796327)]],
		['arccos 0', [i.Operation('Arccos'),i.Scalar(0)], [i.Scalar(1.570796327)]],
		['arccos 1', [i.Operation('Arccos'),i.Scalar(1)], [i.Scalar(0)]],
		['arctan 0', [i.Operation('Arctan'),i.Scalar(0)], [i.Scalar(0)]],
		['arctan 1', [i.Operation('Arctan'),i.Scalar(1)], [i.Scalar(0.7853981634)]],

		['n > r combinations', [i.Scalar(5),i.Operation('Combinations'),i.Scalar(2)], [i.Scalar(10)]],
		['n = r combinations', [i.Scalar(3),i.Operation('Combinations'),i.Scalar(3)], [i.Scalar(1)]],
		['n < r combinations', [i.Scalar(1),i.Operation('Combinations'),i.Scalar(4)], false],
		['r = 0 combinations', [i.Scalar(2),i.Operation('Combinations'),i.Scalar(0)], [i.Scalar(1)]],
		['n negative combinations', [i.Scalar(-2),i.Operation('Combinations'),i.Scalar(3)], false],
		['r negative combinations', [i.Scalar(3),i.Operation('Combinations'),i.Scalar(-2)], false],

		['n > r permutations', [i.Scalar(5),i.Operation('Permutations'),i.Scalar(2)], [i.Scalar(20)]],
		['n = r permutations', [i.Scalar(3),i.Operation('Permutations'),i.Scalar(3)], [i.Scalar(6)]],
		['n < r permutations', [i.Scalar(1),i.Operation('Permutations'),i.Scalar(4)], false],
		['r = 0 permutations', [i.Scalar(2),i.Operation('Permutations'),i.Scalar(0)], [i.Scalar(1)]],
		['n negative permutations', [i.Scalar(-2),i.Operation('Permutations'),i.Scalar(3)], false],
		['r negative permutations', [i.Scalar(3),i.Operation('Permutations'),i.Scalar(-2)], false],

		['normal factorial', [i.Scalar(5),i.Operation('Factorial')], [i.Scalar(120)]],
		['0 factorial', [i.Scalar(0),i.Operation('Factorial')], [i.Scalar(1)]],
		['decimal factorial', [i.Scalar(2.6),i.Operation('Factorial')], false],
		['negative factorial', [i.Scalar(-3),i.Operation('Factorial')], false],

		['log base 10 normal', [i.Operation('Log'), i.Scalar(10), i.Scalar(23)], [i.Scalar(1.361727836)]],
		['log base 10 of 10', [i.Operation('Log'), i.Scalar(10), i.Scalar(10)], [i.Scalar(1)]],
		['log base 0', [i.Operation('Log'), i.Scalar(0), i.Scalar(5)], false],
		['log base negative', [i.Operation('Log'), i.Scalar(-3), i.Scalar(5)], false],
		['log base 10 of negative', [i.Operation('Log'), i.Scalar(10), i.Scalar(-4)], false],
		['log number < base', [i.Operation('Log'), i.Scalar(1000), i.Scalar(10)], [i.Scalar(0.33333333333333333333333333)]],

		['ln normal', [i.Operation('Ln'), i.Scalar(23)], [i.Scalar(3.135494216)]],
		['ln e', [i.Operation('Ln'), i.Scalar(Math.E)], [i.Scalar(1)]],
		['ln 0', [i.Operation('Ln'), i.Scalar(0)], false],
		['ln negative', [i.Operation('Ln'), i.Scalar(-3)], false],

		['scalar add matrix', [i.Scalar(2),i.Operation('Add'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],
		['scalar subtract matrix', [i.Scalar(2),i.Operation('Subtract'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],
		['scalar multiply matrix', [i.Scalar(2),i.Operation('Multiply'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Grid([[i.Scalar(2),i.Scalar(18)],[i.Scalar(12),i.Scalar(10)]])]],

		['scalar divide matrix', [i.Scalar(2),i.Operation('Divide'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],
		['scalar sin function matrix', [i.Scalar(2),i.Operation('Sin'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],
		['scalar exponential matrix', [i.Scalar(2),i.Operation('Exponential'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],
		['scalar combinations matrix', [i.Scalar(2),i.Operation('Combinations'),i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],

		['square matrix exponential scalar', [i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]]), i.Operation('Exponential'), i.Scalar(2)], [i.Grid([[i.Scalar(55),i.Scalar(54)],[i.Scalar(36),i.Scalar(79)]])]],
		['non-square matrix exponential scalar', [i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(2)],[i.Scalar(6),i.Scalar(5),i.Scalar(4)]]), i.Operation('Exponential'), i.Scalar(2)], false],
		['matrix exponential matrix', [i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]]), i.Operation('Exponential'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], false],

		['matrix factorial', [i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]]), i.Operation('Factorial')], false],

		['square matrix determinant', [i.Operation('Determinant'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Scalar(-49)]],
		['square matrix transpose', [i.Operation('Transpose'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Grid([[i.Scalar(1),i.Scalar(6)],[i.Scalar(9),i.Scalar(5)]])]],
		['square matrix minors', [i.Operation('Minors'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Grid([[i.Scalar(5),i.Scalar(6)],[i.Scalar(9),i.Scalar(1)]])]],
		['square matrix cofactors', [i.Operation('Cofactors'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Grid([[i.Scalar(5),i.Scalar(-6)],[i.Scalar(-9),i.Scalar(1)]])]],
		['square matrix adjugate', [i.Operation('Adjugate'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Grid([[i.Scalar(5),i.Scalar(-9)],[i.Scalar(-6),i.Scalar(1)]])]],
		['square matrix inverse', [i.Operation('Inverse'), i.Grid([[i.Scalar(1),i.Scalar(9)],[i.Scalar(6),i.Scalar(5)]])], [i.Grid([[i.Scalar(-5/49),i.Scalar(9/49)],[i.Scalar(6/49),i.Scalar(-1/49)]])]],

		['non-square matrix determinant', [i.Operation('Determinant'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], false],
		['non-square matrix transpose', [i.Operation('Transpose'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], [i.Grid([[i.Scalar(1)], [i.Scalar(9)]])]],
		['non-square matrix minors', [i.Operation('Minors'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], false],
		['non-square matrix cofactors', [i.Operation('Cofactors'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], false],
		['non-square matrix adjugate', [i.Operation('Adjugate'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], false],
		['non-square matrix inverse', [i.Operation('Inverse'), i.Grid([[i.Scalar(1),i.Scalar(9)]])], false],
		
		['1x1 matrix determinant', [i.Operation('Determinant'), i.Grid([[i.Scalar(4)]])], [i.Scalar(4)]],
		['1x1 matrix transpose', [i.Operation('Transpose'), i.Grid([[i.Scalar(4)]])], [i.Grid([[i.Scalar(4)]])]],

		['1x1 matrix minors', [i.Operation('Minors'), i.Grid([[i.Scalar(4)]])], false],
		['1x1 matrix cofactors', [i.Operation('Cofactors'), i.Grid([[i.Scalar(4)]])], false],
		['1x1 matrix adjugate', [i.Operation('Adjugate'), i.Grid([[i.Scalar(4)]])], false],
		['1x1 matrix inverse', [i.Operation('Inverse'), i.Grid([[i.Scalar(4)]])], false],
		['normal minor matrix', [i.Operation('Minor'), i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(4)],[i.Scalar(6),i.Scalar(3),i.Scalar(5)],[i.Scalar(0),i.Scalar(7),i.Scalar(2)]]), i.Scalar(1), i.Scalar(1)], [i.Grid([[i.Scalar(1),i.Scalar(4)],[i.Scalar(0),i.Scalar(2)]])]],
		['below bounds minor matrix', [i.Operation('Minor'), i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(4)],[i.Scalar(6),i.Scalar(3),i.Scalar(5)],[i.Scalar(0),i.Scalar(7),i.Scalar(2)]]), i.Scalar(-2), i.Scalar(-4)], false],
		['above bounds minor matrix', [i.Operation('Minor'), i.Grid([[i.Scalar(1),i.Scalar(9),i.Scalar(4)],[i.Scalar(6),i.Scalar(3),i.Scalar(5)],[i.Scalar(0),i.Scalar(7),i.Scalar(2)]]), i.Scalar(4), i.Scalar(5)], false],

		['2 dimension dot product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Dot Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)]])], [i.Scalar(18)]],
		['3 dimension dot product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Operation('Dot Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], [i.Scalar(26)]],
		['2 by 3 dimension dot product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Dot Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], false],

		['2 dimension cross product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)]])], false],
		['3 dimension cross product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], [i.Grid([[i.Scalar(24)],[i.Scalar(-14)],[i.Scalar(1)]])]],
		['2 by 3 dimension cross product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]])], false],
		['same vectors cross product', [i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Operation('Cross Product'), i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]])], [i.Grid([[i.Scalar(0)],[i.Scalar(0)],[i.Scalar(0)]])]],

		['normal vector from 2d vector', [i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Bracket("]")], [i.Grid([[i.Scalar(7)],[i.Scalar(-4)]])]],
		['normal vector from 2d and 2d vector', [i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Grid([[i.Scalar(1)],[i.Scalar(2)]]), i.Bracket("]")], false],
		['normal vector from 3d and 3d vectors', [i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)],[i.Scalar(2)]]), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(9)]]), i.Bracket("]")], [i.Grid([[i.Scalar(59)],[i.Scalar(-34)],[i.Scalar(1)]])]],
		['normal vector from 2d and 3d vectors', [i.Operation('Normal Vector', true), i.Bracket("["), i.Grid([[i.Scalar(4)],[i.Scalar(7)]]), i.Grid([[i.Scalar(1)],[i.Scalar(2)],[i.Scalar(4)]]), i.Bracket("]")], false]
	];

	// Makes sure the mathematical functions of the calculator give the correct outputs
	self.test = function (showIndividualResults, showIO) {
		// Save the time the testing began
		var testBeginTime = Date.now();

		// Counts for the amount of tests that pass/fail
		var failedCount = 0;
		var passedCount = 0;

		// Performs each test one by one
		var testNumber = 0;
		while (testNumber < testEquations.length) {
			// Get the input equation
			var equation = testEquations[testNumber][1];

			// Halt execution if 'debug' string is present
			if (testEquations[testNumber][2] == 'debug') {
				// Opens browser debug menu
				debugger;
			}
			
			try {
				// Attempt to solve the equation
				var solution = calculator_solve.solveEquation(equation);
			}
			// If an error is thrown, log this in the console
			catch(err) {
				var solution = "Error thrown: " + err
			}

			if (showIndividualResults || showIO)
			{
				// Log the name and input equation of the test to the console
				console.log("%c Test " + (testNumber+1) + " - " +  testEquations[testNumber][0], "font-weight: bold");
			}

			if (showIO)
			{
				console.log("Equation input:");
				console.log(equation);

				// Log the expected output of the test to the console
				console.log("Expected outcome: ");
				console.log(testEquations[testNumber][2]);
				
				// Log the actual output of the test to the console
				console.log("Solution outcome:");
				console.log(solution);
			}
			
			// Compare the JSON string for the expected outcome against the JSON string for the soltuion
			if (JSON.stringify(testEquations[testNumber][2]) == JSON.stringify(solution))
			{
				// If they are identical, the test passed
				if (showIndividualResults)
				{
					console.log("%c PASSED", "color: green");
				}

				passedCount += 1;
			}
			else
			{
				// If they are not identical, the test failed
				if (showIndividualResults)
				{
					console.log("%c FAILED", "color: red");
				}

				failedCount += 1;
			}

			if (showIndividualResults)
			{
				// Add a blank line to seperate the tests
				console.log("");
			}

			// Move on to the next test
			testNumber += 1;
		}

		// Get the time at the end of the test
		var testEndTime = Date.now();

		// Log the time taken to complete the tests
		console.log("%c ALL TESTS COMPLETED IN: " + (testEndTime - testBeginTime) + " milliseconds", "color: purple");

		// Log the total results counts
		console.log("%c PASSED: " + passedCount, "color: purple");
		console.log("%c FAILED: " + failedCount, "color: purple");
	}

	return self;
}();