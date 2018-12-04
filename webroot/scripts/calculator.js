window.addEventListener("resize", calculator_layout.resizePage, false);

calculator_layout.createMainDiv();

calculator_build.setItemCounts();

calculator_canvas.registerMouseEvents();
calculator_canvas.setupWebGL();

calculator_layout.resizePage();

requestAnimationFrame(calculator_canvas.render);