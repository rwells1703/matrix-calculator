// Creates an empty item that can become a scalar, matrix or operator
function createEmptyItem(itemClass, itemCount) {
	var itemWrapper = document.createElement("div");
	itemWrapper.className = itemClass;
	itemWrapper.id = itemCount;
	itemWrapper.style.display = "grid";
	itemWrapper.style.gridTemplateColumns = "repeat(11, 1fr)";
	itemWrapper.style.gridTemplateRows = "repeat(9, 1fr)"; 
	itemWrapper.style.background = "white";
	itemWrapper.style.padding = 0;
	itemWrapper.style.height = "30vh";
	itemWrapper.style.marginBottom = "4vh";
	itemWrapper.style.boxShadow = "var(--theme-box-shadow)";
	itemWrapper.style.animationName = "fadeIn";
	itemWrapper.style.animationDuration = "0.5s";
	
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
	itemMoveUpIcon.src = "images/moveup.svg";
	itemMoveUpIcon.style.cursor = "pointer";
	itemMoveUpIcon.style.height = "100%";
	itemMoveUpIcon.style.margin = "0 auto";
	itemMoveUpIcon.style.gridColumnStart = 2;
	itemMoveUpIcon.style.gridColumnEnd = 3;
	itemMoveUpIcon.style.gridRowStart = 4;
	itemMoveUpIcon.style.gridRowEnd = 5;
	itemMoveUpIcon.onclick = moveItemUp;
	
	var itemDeleteIcon = document.createElement("img");
	itemDeleteIcon.src = "images/delete.svg";
	itemDeleteIcon.style.cursor = "pointer";
	itemDeleteIcon.style.height = "100%";
	itemDeleteIcon.style.margin = "0 auto";
	itemDeleteIcon.style.gridColumnStart = 2;
	itemDeleteIcon.style.gridColumnEnd = 3;
	itemDeleteIcon.style.gridRowStart = 6;
	itemDeleteIcon.style.gridRowEnd = 7;
	itemDeleteIcon.onclick = deleteItem;
	
	var itemMoveDownIcon = document.createElement("img");
	itemMoveDownIcon.src = "images/movedown.svg";
	itemMoveDownIcon.style.cursor = "pointer";
	itemMoveDownIcon.style.height = "100%";
	itemMoveDownIcon.style.margin = "0 auto";
	itemMoveDownIcon.style.gridColumnStart = 2;
	itemMoveDownIcon.style.gridColumnEnd = 3;
	itemMoveDownIcon.style.gridRowStart = 8;
	itemMoveDownIcon.style.gridRowEnd = 9;
	itemMoveDownIcon.onclick = moveItemDown;

	itemWrapper.appendChild(itemSidebar);
	itemWrapper.appendChild(itemName);
	itemWrapper.appendChild(itemMoveUpIcon);
	itemWrapper.appendChild(itemDeleteIcon);
	itemWrapper.appendChild(itemMoveDownIcon);
	
	return itemWrapper;
}

// Creates a scalar item
function addScalar() {
	scalarCount += 1;
	var scalarWrapper = createEmptyItem("scalar", scalarCount);
	
	var scalarTextbox = document.createElement("input");
	scalarTextbox.style.boxSizing = "border-box";
	scalarTextbox.style.width = "100%";
	scalarTextbox.style.borderWidth = 1;
	scalarTextbox.style.borderStyle = "solid";
	scalarTextbox.style.borderColor = "var(--theme-color-textbox-border)";
	scalarTextbox.style.gridColumnStart = 4;
	scalarTextbox.style.gridColumnEnd = 5;
	scalarTextbox.style.gridRowStart = 2;
	scalarTextbox.style.gridRowEnd = 3;
	scalarTextbox.style.textAlign = "center";
	scalarTextbox.type = "text";
	scalarWrapper.appendChild(scalarTextbox);
	
	itemDiv.appendChild(scalarWrapper);
}

// Creates a matrix item
function addMatrix() {
	matrixCount += 1;
	var matrixWrapper = createEmptyItem("matrix", matrixCount);
	
	var r = 0;
	while (r < 7) {
		var c = 0;
		while (c < 7) {
			var matrixElementTextbox = document.createElement("input");
			matrixElementTextbox.style.boxSizing = "border-box";
			matrixElementTextbox.style.width = "90%";
			matrixElementTextbox.style.height = "90%";
			matrixElementTextbox.style.borderWidth = 1;
			matrixElementTextbox.style.borderStyle = "solid";
			matrixElementTextbox.style.borderColor = "var(--theme-color-textbox-border)";
			matrixElementTextbox.style.textAlign = "center";
			matrixElementTextbox.type = "text";
			
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
	addMatrixRowIcon.onclick = addMatrixRow;
	
	var removeMatrixRowIcon = document.createElement("img");
	removeMatrixRowIcon.src = "images/remove.svg";
	removeMatrixRowIcon.style.cursor = "pointer";
	removeMatrixRowIcon.style.height = "100%";
	removeMatrixRowIcon.style.margin = "0 auto";
	removeMatrixRowIcon.style.gridColumnStart = 5;
	removeMatrixRowIcon.style.gridColumnEnd = 6;
	removeMatrixRowIcon.style.gridRowStart = 9;
	removeMatrixRowIcon.style.gridRowEnd = 10;
	removeMatrixRowIcon.onclick = removeMatrixRow;
	
	var addMatrixColumnIcon = document.createElement("img");
	addMatrixColumnIcon.src = "images/add.svg";
	addMatrixColumnIcon.style.cursor = "pointer";
	addMatrixColumnIcon.style.height = "100%";
	addMatrixColumnIcon.style.margin = "0 auto";
	addMatrixColumnIcon.style.gridColumnStart = 11;
	addMatrixColumnIcon.style.gridColumnEnd = 12;
	addMatrixColumnIcon.style.gridRowStart = 2;
	addMatrixColumnIcon.style.gridRowEnd = 3;
	addMatrixColumnIcon.onclick = addMatrixColumn;
	
	var removeMatrixColumnIcon = document.createElement("img");
	removeMatrixColumnIcon.src = "images/remove.svg";
	removeMatrixColumnIcon.style.cursor = "pointer";
	removeMatrixColumnIcon.style.height = "100%";
	removeMatrixColumnIcon.style.margin = "0 auto";
	removeMatrixColumnIcon.style.gridColumnStart = 11;
	removeMatrixColumnIcon.style.gridColumnEnd = 12;
	removeMatrixColumnIcon.style.gridRowStart = 3;
	removeMatrixColumnIcon.style.gridRowEnd = 4;
	removeMatrixColumnIcon.onclick = removeMatrixColumn;
	
	matrixWrapper.appendChild(addMatrixRowIcon);
	matrixWrapper.appendChild(removeMatrixRowIcon);
	matrixWrapper.appendChild(addMatrixColumnIcon);
	matrixWrapper.appendChild(removeMatrixColumnIcon);
	itemDiv.appendChild(matrixWrapper);
}

function addMatrixRow() {
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
}

function removeMatrixRow() {
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
}

function addMatrixColumn() {
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
}

function removeMatrixColumn() {
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
}

function createOperatorButton(innerHTML, positionsFromLeft) {
	button = document.createElement("div");
	
	button.className = "operatorButton"; 
	button.innerHTML = innerHTML;
	button.style.height = "90%";
	button.style.width = "90%";
	button.style.boxSizing = "border-box";
	button.style.textAlign = "center";
	
	button.style.borderWidth = 1;
	button.style.borderStyle = "solid";
	button.style.borderColor = "var(--theme-color-textbox-border)";
	button.style.backgroundColor = "white";
	
	button.style.cursor = "pointer";
	button.onclick = selectOperator;
	
	button.style.gridColumnStart = 4+(positionsFromLeft % 4);
	button.style.gridColumnEnd = 5+(positionsFromLeft % 4);
	button.style.gridRowStart = 2+Math.floor(positionsFromLeft/4);
	button.style.gridRowEnd = 3+Math.floor(positionsFromLeft/4);
	
	return button;
}

function selectOperator(event) {
	var operatorItem = event["path"][0].parentNode;
	var i = 0;
	while (i < operatorItem.children.length) {
		if (operatorItem.children[i].className == "operatorButton") {
			operatorItem.children[i].style.borderColor = "var(--theme-color-textbox-border)";
			operatorItem.children[i].style.backgroundColor = "white";
		}
		i += 1;
	}
	
	var operatorButton = event["path"][0];
	operatorButton.style.borderColor = "var(--theme-color-main)";
	operatorButton.style.backgroundColor = "var(--theme-color-main-light)";
	operatorItem.setAttribute("operator", operatorButton.innerHTML);
}

// Creates an operator item
function addOperator() {
	operatorCount += 1;
	var operatorWrapper = createEmptyItem("operator", operatorCount);
	
	var addButton = createOperatorButton("+", 0);
	var subtractButton = createOperatorButton("-", 1);
	var dotProductButton = createOperatorButton("·", 2);
	var crossProductButton = createOperatorButton("x", 3);
	var exponentButton = createOperatorButton("^", 4);
	var inverseButton = createOperatorButton("inv", 5);
	var transposeButton = createOperatorButton("tra", 6);
	var determinantButton = createOperatorButton("det", 7);
	
	operatorWrapper.appendChild(addButton);
	operatorWrapper.appendChild(subtractButton);
	operatorWrapper.appendChild(dotProductButton);
	operatorWrapper.appendChild(crossProductButton);
	operatorWrapper.appendChild(exponentButton);
	operatorWrapper.appendChild(inverseButton);
	operatorWrapper.appendChild(transposeButton);
	operatorWrapper.appendChild(determinantButton);
	
	itemDiv.appendChild(operatorWrapper);
}

function deleteItem(event) {
	// Gets parent element of the delete icon that was clicked
	var item = event["path"][1];
	
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
	
	if (item.className == "scalar") {
		scalarCount -= 1;
	}
	else if (item.className == "matrix") {
		matrixCount -= 1;
	}
	else {
		operatorCount -= 1;
	}
	
	item.parentNode.removeChild(item);
}

function moveItemUp(event) {
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
}

function moveItemDown(event) {
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
}