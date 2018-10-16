// Declare namespace
calculator_equation_builder = {};

(function(context) {
	// Counts increase/decrease for every item added/removed from the equation
	context.setItemCounts = function() {
		matrixCount = 0;
		scalarCount = 0;
		functionCount = 0;
		operatorCount = 0;
	};
	
	// Creates an empty item that can become a scalar, matrix or operator
	context.createEmptyItem = function(itemClass, itemCount) {
		var itemWrapper = document.createElement("div");
		itemWrapper.className = itemClass;
		itemWrapper.id = itemCount;
		itemWrapper.style.display = "grid";
		itemWrapper.style.gridTemplateColumns = "repeat(11, 1fr)";
		itemWrapper.style.gridTemplateRows = "repeat(9, 1fr)"; 
		itemWrapper.style.background = "var(--theme-color-page-background-light)";
		itemWrapper.style.padding = 0;
		itemWrapper.style.height = "30vh";
		itemWrapper.style.marginBottom = "4vh";
		itemWrapper.style.boxShadow = "var(--theme-box-shadow)";
		itemWrapper.style.borderRadius = "var(--theme-border-radius)";
		itemWrapper.style.animationName = "fadeIn";
		itemWrapper.style.animationDuration = "0.25s";
		
		var itemSidebar = document.createElement("div");
		itemSidebar.style.gridColumnStart = 1;
		itemSidebar.style.gridColumnEnd = 3;
		itemSidebar.style.gridRowStart = 1;
		itemSidebar.style.gridRowEnd = 10;
		
		var itemName = document.createElement("div");
		itemName.style.gridColumnStart = 1;
		itemName.style.gridColumnEnd = 3;
		itemName.style.gridRowStart = 1;
		itemName.style.gridRowEnd = 2;
		itemName.style.padding = 0;
		itemName.style.textAlign = "center";
		itemName.innerHTML = itemWrapper.className + itemWrapper.id;
		
		var itemMoveUpIcon = document.createElement("img");
		itemMoveUpIcon.src = "images/move_up.svg";
		itemMoveUpIcon.style.cursor = "pointer";
		itemMoveUpIcon.style.height = "100%";
		itemMoveUpIcon.style.margin = "0 auto";
		itemMoveUpIcon.style.gridColumnStart = 2;
		itemMoveUpIcon.style.gridColumnEnd = 3;
		itemMoveUpIcon.style.gridRowStart = 4;
		itemMoveUpIcon.style.gridRowEnd = 5;
		itemMoveUpIcon.onclick = context.moveItemUp;
		
		var itemDeleteIcon = document.createElement("img");
		itemDeleteIcon.src = "images/delete.svg";
		itemDeleteIcon.style.cursor = "pointer";
		itemDeleteIcon.style.height = "100%";
		itemDeleteIcon.style.margin = "0 auto";
		itemDeleteIcon.style.gridColumnStart = 2;
		itemDeleteIcon.style.gridColumnEnd = 3;
		itemDeleteIcon.style.gridRowStart = 6;
		itemDeleteIcon.style.gridRowEnd = 7;
		itemDeleteIcon.onclick = context.deleteItem;
		
		var itemMoveDownIcon = document.createElement("img");
		itemMoveDownIcon.src = "images/move_down.svg";
		itemMoveDownIcon.style.cursor = "pointer";
		itemMoveDownIcon.style.height = "100%";
		itemMoveDownIcon.style.margin = "0 auto";
		itemMoveDownIcon.style.gridColumnStart = 2;
		itemMoveDownIcon.style.gridColumnEnd = 3;
		itemMoveDownIcon.style.gridRowStart = 8;
		itemMoveDownIcon.style.gridRowEnd = 9;
		itemMoveDownIcon.onclick = context.moveItemDown;

		itemWrapper.appendChild(itemSidebar);
		itemWrapper.appendChild(itemName);
		itemWrapper.appendChild(itemMoveUpIcon);
		itemWrapper.appendChild(itemDeleteIcon);
		itemWrapper.appendChild(itemMoveDownIcon);
		
		context.toggleEquationFinishButtons();
		
		return itemWrapper;
	};
	
	// Deletes the selected item when the user clicks the delete icon
	context.deleteItem = function(event) {
		// Gets parent element of the delete icon that was clicked
		var item = event["path"][1];
		
		if (item.className == "scalar") {
			scalarCount -= 1;
		}
		else if (item.className == "matrix") {
			matrixCount -= 1;
		}
		else if (item.className == "function") {
			functionCount -= 1;
		}
		else {
			operatorCount -= 1;
		}
		
		// Animates the removal of the item
		item.style.animationName = "fadeOut";
		
		context.toggleEquationFinishButtons();
		
		var itemDiv = document.getElementById("itemDiv");
		
		// Deletes the item 200ms later so that deletion occurs slightly before animation ends (prevents flicker)
		setTimeout(function() {
			// Changes id, name and count so that each item is still in order
			var i = 0;
			while (i < itemDiv.children.length) {
				// Only change item ids of items with the same class
				if (itemDiv.children[i].className == item.className) {
					if (parseInt(itemDiv.children[i].id) > parseInt(item.id)) {
						// Change id
						itemDiv.children[i].id = parseInt(itemDiv.children[i].id) - 1;
						// Change the name that is displayed
						itemDiv.children[i].children[1].innerHTML = itemDiv.children[i].className + itemDiv.children[i].id;
					}
				}
				i += 1;
			}
			
			item.parentNode.removeChild(item);
		}, 200);
	};
	
	// Moves an item upwards in the equation, swapping it with the item above
	context.moveItemUp = function(event) {
		var item = event["path"][0].parentNode;
		var previousItem = item.previousSibling;
		
		if (previousItem != null) {
			var parent = item.parentNode;
			
			parent.removeChild(item);
			parent.insertBefore(item, previousItem);
			
			// Swaps id's back if items are both of the same class (e.g. both scalars)
			if (previousItem.className == item.className) {
				var tempId = item.id;
				item.id = previousItem.id;
				previousItem.id = tempId;
				
				item.children[1].innerHTML = item.className + item.id;
				previousItem.children[1].innerHTML = previousItem.className + previousItem.id;
			}
		}
	};

	// Moves an item downwards in the equation, swapping it with the item below
	context.moveItemDown = function(event) {
		var item = event["path"][0].parentNode;
		var nextItem = item.nextSibling;
		
		if (nextItem != null) {
			var parent = item.parentNode;
			
			parent.removeChild(item);
			
			// If removing the item before last, it must be re-inserted as the last item
			// Because it is the item before last, nextItem.nextSibling will be null meaning we have to use parent.appendChild instead of parent.insertBefore
			if (nextItem.nextSibling == null) {
				parent.appendChild(item);
			}
			else {
				parent.insertBefore(item, nextItem.nextSibling);
			}
			
			// Swaps id's back if items are both of the same class (e.g. both scalars)
			if (nextItem.className == item.className) {
				var tempId = item.id;
				item.id = nextItem.id;
				nextItem.id = tempId;

				item.children[1].innerHTML = item.className + item.id;
				nextItem.children[1].innerHTML = nextItem.className + nextItem.id;
			}
		}
	};

	// Creates a new text box for inputting values e.g. in a scalar or matrix item
	context.createInputTextbox = function() {
		var inputTextbox = document.createElement("input");
		inputTextbox.style.boxSizing = "border-box";
		inputTextbox.style.width = "90%";
		inputTextbox.style.height = "90%";
		inputTextbox.style.margin = "auto auto";
		inputTextbox.style.borderWidth = 1;
		inputTextbox.style.borderStyle = "solid";
		inputTextbox.style.borderColor = "var(--theme-color-textbox-border)";
		inputTextbox.style.backgroundColor = "var(--theme-color-page-background)";
		inputTextbox.style.color = "var(--theme-color-text)";
		inputTextbox.style.textAlign = "center";
		inputTextbox.type = "text";
		
		return inputTextbox;
	};

	// Creates a scalar item
	context.addScalar = function() {
		var itemDiv = document.getElementById("itemDiv");
		
		scalarCount += 1;
		var scalarWrapper = context.createEmptyItem("scalar", scalarCount);
		
		var scalarTextbox = context.createInputTextbox();
		scalarTextbox.style.gridColumnStart = 4;
		scalarTextbox.style.gridColumnEnd = 5;
		scalarTextbox.style.gridRowStart = 2;
		scalarTextbox.style.gridRowEnd = 3;
		scalarWrapper.appendChild(scalarTextbox);
		itemDiv.appendChild(scalarWrapper);
	};

	// Creates a matrix item
	context.addMatrix = function() {
		var itemDiv = document.getElementById("itemDiv");
		
		matrixCount += 1;
		var matrixWrapper = context.createEmptyItem("matrix", matrixCount);
		
		var r = 0;
		while (r < 7) {
			var c = 0;
			while (c < 7) {
				var matrixElementTextbox = context.createInputTextbox();
				matrixElementTextbox.style.gridColumnStart = 4+c;
				matrixElementTextbox.style.gridColumnEnd = 5+c;
				matrixElementTextbox.style.gridRowStart = 2+r;
				matrixElementTextbox.style.gridRowEnd = 3+r;
				matrixWrapper.appendChild(matrixElementTextbox);
				
				// Hide any rows or elements so only a 2x2 matrix shows
				if (r > 1 || c > 1) {
					matrixWrapper.lastChild.style.visibility = "hidden";
				}
				c += 1;
			}
			r += 1;
		}
		
		matrixWrapper.setAttribute("rows", 2);
		matrixWrapper.setAttribute("columns", 2);
		
		var addMatrixRowIcon = document.createElement("img");
		addMatrixRowIcon.src = "images/add.svg";
		addMatrixRowIcon.style.cursor = "pointer";
		addMatrixRowIcon.style.height = "100%";
		addMatrixRowIcon.style.margin = "0 auto";
		addMatrixRowIcon.style.gridColumnStart = 4;
		addMatrixRowIcon.style.gridColumnEnd = 5;
		addMatrixRowIcon.style.gridRowStart = 9;
		addMatrixRowIcon.style.gridRowEnd = 10;
		addMatrixRowIcon.onclick = context.addMatrixRow;
		
		var removeMatrixRowIcon = document.createElement("img");
		removeMatrixRowIcon.src = "images/remove.svg";
		removeMatrixRowIcon.style.cursor = "pointer";
		removeMatrixRowIcon.style.height = "100%";
		removeMatrixRowIcon.style.margin = "0 auto";
		removeMatrixRowIcon.style.gridColumnStart = 5;
		removeMatrixRowIcon.style.gridColumnEnd = 6;
		removeMatrixRowIcon.style.gridRowStart = 9;
		removeMatrixRowIcon.style.gridRowEnd = 10;
		removeMatrixRowIcon.onclick = context.removeMatrixRow;
		
		var addMatrixColumnIcon = document.createElement("img");
		addMatrixColumnIcon.src = "images/add.svg";
		addMatrixColumnIcon.style.cursor = "pointer";
		addMatrixColumnIcon.style.height = "100%";
		addMatrixColumnIcon.style.margin = "0 auto";
		addMatrixColumnIcon.style.gridColumnStart = 11;
		addMatrixColumnIcon.style.gridColumnEnd = 12;
		addMatrixColumnIcon.style.gridRowStart = 2;
		addMatrixColumnIcon.style.gridRowEnd = 3;
		addMatrixColumnIcon.onclick = context.addMatrixColumn;
		
		var removeMatrixColumnIcon = document.createElement("img");
		removeMatrixColumnIcon.src = "images/remove.svg";
		removeMatrixColumnIcon.style.cursor = "pointer";
		removeMatrixColumnIcon.style.height = "100%";
		removeMatrixColumnIcon.style.margin = "0 auto";
		removeMatrixColumnIcon.style.gridColumnStart = 11;
		removeMatrixColumnIcon.style.gridColumnEnd = 12;
		removeMatrixColumnIcon.style.gridRowStart = 3;
		removeMatrixColumnIcon.style.gridRowEnd = 4;
		removeMatrixColumnIcon.onclick = context.removeMatrixColumn;
		
		matrixWrapper.appendChild(addMatrixRowIcon);
		matrixWrapper.appendChild(removeMatrixRowIcon);
		matrixWrapper.appendChild(addMatrixColumnIcon);
		matrixWrapper.appendChild(removeMatrixColumnIcon);
		
		itemDiv.appendChild(matrixWrapper);
	};
	
	// Adds a new row to a matrix item
	context.addMatrixRow = function() {
		var matrixWrapper = event["path"][1];
		var rows = parseInt(matrixWrapper.getAttribute("rows"));
		var columns = parseInt(matrixWrapper.getAttribute("columns"));
		
		if (rows < 6) {
			var c = 0;
			while (c < columns) {
				elementNumber = 7*rows + c + 5
				matrixWrapper.children[elementNumber].style.visibility = "";
				c += 1;
			}
			matrixWrapper.setAttribute("rows", rows+1)
		}
	};
	
	// Removes a row from the matrix item
	context.removeMatrixRow = function() {
		var matrixWrapper = event["path"][1];
		var rows = parseInt(matrixWrapper.getAttribute("rows"));
		var columns = parseInt(matrixWrapper.getAttribute("columns"));
		
		if (rows > 1) {
			var c = 0;
			while (c < columns) {
				elementNumber = 7*(rows-1) + c + 5
				matrixWrapper.children[elementNumber].style.visibility = "hidden";
				c += 1;
			}
			matrixWrapper.setAttribute("rows", rows-1)
		}
	};

	// Adds a new column to a matrix item
	context.addMatrixColumn = function() {
		var matrixWrapper = event["path"][1];
		var rows = parseInt(matrixWrapper.getAttribute("rows"));
		var columns = parseInt(matrixWrapper.getAttribute("columns"));
		
		if (columns < 6) {
			var r = 0;
			while (r < rows) {
				elementNumber = 7*r + columns + 5
				matrixWrapper.children[elementNumber].style.visibility = "";
				r += 1;
			}
			matrixWrapper.setAttribute("columns", columns+1)
		}
	};

	// Removes a column from the matrix item
	context.removeMatrixColumn = function() {
		var matrixWrapper = event["path"][1];
		var rows = parseInt(matrixWrapper.getAttribute("rows"));
		var columns = parseInt(matrixWrapper.getAttribute("columns"));
		
		if (columns > 1) {
			var r = 0;
			while (r < rows) {
				elementNumber = 7*r + (columns-1) + 5
				matrixWrapper.children[elementNumber].style.visibility = "hidden";
				r += 1;
			}
			matrixWrapper.setAttribute("columns", columns-1);
		}
	};

	// Creates a selectable button in an item, for selecting one value out of many
	context.createItemButton = function(innerHTML, positionsFromLeft) {
		var button = document.createElement("div");
		
		button.className = "selectionButton"; 
		button.innerHTML = innerHTML;
		button.style.height = "90%";
		button.style.width = "90%";
		button.style.margin = "auto auto";
		button.style.boxSizing = "border-box";
		button.style.textAlign = "center";
		
		button.style.borderWidth = 1;
		button.style.borderStyle = "solid";
		button.style.borderColor = "var(--theme-color-textbox-border)";
		button.style.backgroundColor = "var(--theme-color-page-background)";
		
		button.style.cursor = "pointer";
		button.onclick = context.selectButton;
		
		var buttonsPerRow = 6;
		button.style.gridColumnStart = 4+(positionsFromLeft % buttonsPerRow);
		button.style.gridColumnEnd = 5+(positionsFromLeft % buttonsPerRow);
		button.style.gridRowStart = 2+Math.floor(positionsFromLeft / buttonsPerRow);
		button.style.gridRowEnd = 3+Math.floor(positionsFromLeft / buttonsPerRow);
		
		return button;
	};

	// Creates a function item
	context.addFunction = function() {
		var itemDiv = document.getElementById("itemDiv");
		
		functionCount += 1;
		var functionWrapper = context.createEmptyItem("function", functionCount);
		
		var transposeButton = context.createItemButton("Tra", 0);
		var determinantButton = context.createItemButton("Det", 1);
		var sinButton = context.createItemButton("Sin", 2);
		var cosButton = context.createItemButton("Cos", 3);
		var tanButton = context.createItemButton("Tan", 4);
		
		functionWrapper.append(transposeButton);
		functionWrapper.append(determinantButton);
		functionWrapper.append(sinButton);
		functionWrapper.append(cosButton);
		functionWrapper.append(tanButton);
		
		itemDiv.appendChild(functionWrapper);
	};

	// Creates a operator item
	context.addOperator = function() {
		var itemDiv = document.getElementById("itemDiv");
		
		operatorCount += 1;
		var operatorWrapper = context.createEmptyItem("operator", operatorCount);
		
		var addButton = context.createItemButton("+", 0);
		var subtractButton = context.createItemButton("-", 1);
		var multiplyButton = context.createItemButton("*", 2);
		var divideButton = context.createItemButton("/", 3);
		var exponentialButton = context.createItemButton("^", 4);
		var dotProductButton = context.createItemButton("&middot", 5);
		var crossProductButton = context.createItemButton("x", 6);
		var openBracketButton = context.createItemButton("(", 7);
		var closeBracketButton = context.createItemButton(")", 8);
		
		operatorWrapper.appendChild(addButton);
		operatorWrapper.appendChild(subtractButton);
		operatorWrapper.appendChild(multiplyButton);
		operatorWrapper.appendChild(divideButton);
		operatorWrapper.appendChild(exponentialButton);
		operatorWrapper.appendChild(dotProductButton);
		operatorWrapper.appendChild(crossProductButton);
		operatorWrapper.appendChild(openBracketButton);
		operatorWrapper.appendChild(closeBracketButton);
		
		itemDiv.appendChild(operatorWrapper);
	};

	// Changes the function/operator of an function/operator item based on user mouse click
	context.selectButton = function(event) {
		var selectedButton = event["path"][0];
		
		// Resets all the other buttons so that they are unselected
		var i = 0;
		while (i < selectedButton.parentNode.children.length) {
			if (selectedButton.parentNode.children[i].className == "selectionButton") {
				selectedButton.parentNode.children[i].style.borderColor = "var(--theme-color-textbox-border)";
				selectedButton.parentNode.children[i].style.backgroundColor = "var(--theme-color-page-background)";
			}
			i += 1;
		}
		
		// Hilights the selected button with the main color
		selectedButton.style.borderColor = "var(--theme-color-main)";
		selectedButton.style.backgroundColor = "var(--theme-color-main-light)";
		
		// Sets the value attribute of the function/operator item
		selectedButton.parentNode.setAttribute("value", selectedButton.innerHTML);
	};
	
	// Shows/hides the "solve" and "export" buttons at the bottom of the equation div
	// They are hidden if there are no items, otherwise they are visible
	context.toggleEquationFinishButtons = function() {
		var equationFinishButtonDiv = document.getElementById("equationFinishButtonDiv");
		
		if (scalarCount == 0 && matrixCount == 0 && operatorCount == 0 && functionCount == 0) {
			// If there are no items, dont show the finish "solve" and "export" buttons
			// Resets the animation so it can be played again
			equationFinishButtonDiv.style.animationName = "fadeOut";
			setTimeout(function() {
				equationFinishButtonDiv.style.animationName = "";
				equationFinishButtonDiv.style.visibility = "hidden";
			},200);
		} else {
			// Otherwise show them
			// Plays the animation again
			equationFinishButtonDiv.style.animationName = "fadeIn";
			equationFinishButtonDiv.style.visibility = "";
		}
	};
})(calculator_equation_builder);