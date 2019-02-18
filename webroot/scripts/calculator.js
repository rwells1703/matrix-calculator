// Registers the resize page function to the window resize event
window.addEventListener("resize", calculator_layout.resizePage, false);

// Creates the main layout of the page including item list and graph
calculator_layout.createMainDiv();

// Sets the counts for all the items to 0 ready for the user to edit the equation
calculator_build.resetItemCounts();

// Run the unit tests for the mathematical operations
unit_tests.test();

// Registers click events on the canvas
calculator_canvas.registerMouseEvents();
// Sets up the webgl context for the canvas
calculator_canvas.setupWebGL();

// Resizes the page to fit the canavs and the equation items
calculator_layout.resizePage();

// Begins refreshing the canvas frames
requestAnimationFrame(calculator_canvas.render);