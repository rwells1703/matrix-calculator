// Creates an empty item that can become a scalar, matrix or operator
function createEmptyItem(itemClass, itemCount) {
	var itemWrapper = document.createElement("div");
	itemWrapper.className = itemClass;
	itemWrapper.id = itemCount;
	itemWrapper.style.display = "grid";
	itemWrapper.style.gridTemplateColumns = "repeat(11, 1fr)";
	itemWrapper.style.gridTemplateRows = "repeat(9, 1fr)"; 
	itemWrapper.style.background = "#d6d6d6";
	itemWrapper.style.padding = 0;
	itemWrapper.style.marginBottom = "2vh";
	
	var itemSidebar = document.createElement("div");
	itemSidebar.class = "itemSidebar";
	itemSidebar.style.gridColumnStart = 1;
	itemSidebar.style.gridColumnEnd = 3;
	itemSidebar.style.gridRowStart = 1;
	itemSidebar.style.gridRowEnd = 10;
	itemSidebar.style.background = "#cccccc";
	
	var itemName = document.createElement("div");
	itemName.style.gridColumnStart = 1;
	itemName.style.gridColumnEnd = 3;
	itemName.style.gridRowStart = 1;
	itemName.style.gridRowEnd = 2;
	itemName.style.background = "#aaaaaa";
	itemName.style.padding = 0;
	itemName.style.textAlign = "center";
	itemName.innerHTML = itemWrapper.className + itemWrapper.id;
	
	var itemMoveUpIcon = document.createElement("img");
	itemMoveUpIcon.src = "images/moveup.png";
	itemMoveUpIcon.style.cursor = "pointer";
	itemMoveUpIcon.style.imageRendering = "pixelated";
	itemMoveUpIcon.style.height = "100%";
	itemMoveUpIcon.style.margin = "0 auto";
	itemMoveUpIcon.style.gridColumnStart = 2;
	itemMoveUpIcon.style.gridColumnEnd = 3;
	itemMoveUpIcon.style.gridRowStart = 4;
	itemMoveUpIcon.style.gridRowEnd = 5;
	itemMoveUpIcon.onclick = moveItemUp;
	
	var itemDeleteIcon = document.createElement("img");
	itemDeleteIcon.src = "images/delete.png";
	itemDeleteIcon.style.cursor = "pointer";
	itemDeleteIcon.style.imageRendering = "pixelated";
	itemDeleteIcon.style.height = "100%";
	itemDeleteIcon.style.margin = "0 auto";
	itemDeleteIcon.style.gridColumnStart = 2;
	itemDeleteIcon.style.gridColumnEnd = 3;
	itemDeleteIcon.style.gridRowStart = 6;
	itemDeleteIcon.style.gridRowEnd = 7;
	itemDeleteIcon.onclick = deleteItem;
	
	var itemMoveDownIcon = document.createElement("img");
	itemMoveDownIcon.src = "images/movedown.png";
	itemMoveDownIcon.style.cursor = "pointer";
	itemMoveDownIcon.style.imageRendering = "pixelated";
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
	scalarTextbox.class = "scalarTextbox";
	scalarTextbox.style.boxSizing = "border-box";
	scalarTextbox.style.width = "100%";
	scalarTextbox.style.gridColumnStart = 4;
	scalarTextbox.style.gridColumnEnd = 5;
	scalarTextbox.style.gridRowStart = 2;
	scalarTextbox.style.gridRowEnd = 3;
	scalarTextbox.style.textAlign = "center";
	scalarTextbox.type = "text";
	
	scalarWrapper.appendChild(scalarTextbox);
	
	itemDiv.appendChild(scalarWrapper);
	
	resizeTopRowButtons();
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
			matrixElementTextbox.class = "matrixElementTextbox";
			matrixElementTextbox.style.boxSizing = "border-box";
			matrixElementTextbox.style.width = "100%";
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
	addMatrixRowIcon.class = "addMatrixRowIcon";
	addMatrixRowIcon.src = "images/add.png";
	addMatrixRowIcon.style.cursor = "pointer";
	addMatrixRowIcon.style.imageRendering = "pixelated";
	addMatrixRowIcon.style.height = "100%";
	addMatrixRowIcon.style.margin = "0 auto";
	addMatrixRowIcon.style.gridColumnStart = 4;
	addMatrixRowIcon.style.gridColumnEnd = 5;
	addMatrixRowIcon.style.gridRowStart = 9;
	addMatrixRowIcon.style.gridRowEnd = 10;
	addMatrixRowIcon.onclick = addMatrixRow;
	
	var removeMatrixRowIcon = document.createElement("img");
	removeMatrixRowIcon.class = "removeMatrixRowIcon";
	removeMatrixRowIcon.src = "images/remove.png";
	removeMatrixRowIcon.style.cursor = "pointer";
	removeMatrixRowIcon.style.imageRendering = "pixelated";
	removeMatrixRowIcon.style.height = "100%";
	removeMatrixRowIcon.style.margin = "0 auto";
	removeMatrixRowIcon.style.gridColumnStart = 5;
	removeMatrixRowIcon.style.gridColumnEnd = 6;
	removeMatrixRowIcon.style.gridRowStart = 9;
	removeMatrixRowIcon.style.gridRowEnd = 10;
	removeMatrixRowIcon.onclick = removeMatrixRow;
	
	var addMatrixColumnIcon = document.createElement("img");
	addMatrixColumnIcon.class = "addMatrixColumnIcon";
	addMatrixColumnIcon.src = "images/add.png";
	addMatrixColumnIcon.style.cursor = "pointer";
	addMatrixColumnIcon.style.imageRendering = "pixelated";
	addMatrixColumnIcon.style.height = "100%";
	addMatrixColumnIcon.style.margin = "0 auto";
	addMatrixColumnIcon.style.gridColumnStart = 11;
	addMatrixColumnIcon.style.gridColumnEnd = 12;
	addMatrixColumnIcon.style.gridRowStart = 2;
	addMatrixColumnIcon.style.gridRowEnd = 3;
	addMatrixColumnIcon.onclick = addMatrixColumn;
	
	var removeMatrixColumnIcon = document.createElement("img");
	removeMatrixColumnIcon.class = "removeMatrixColumnIcon";
	removeMatrixColumnIcon.src = "images/remove.png";
	removeMatrixColumnIcon.style.cursor = "pointer";
	removeMatrixColumnIcon.style.imageRendering = "pixelated";
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
	
	resizeTopRowButtons();
}

function addMatrixRow() {
	var matrixWrapper = event["path"][1];
	var rows = parseInt(matrixWrapper.getAttribute("rows"));
	var columns = parseInt(matrixWrapper.getAttribute("columns"));

	if (rows < 7) {
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
	
	if (columns < 7) {
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
	
	if (item.class == "scalar") {
		scalarCount -= 1;
	}
	else if (item.class == "matrix") {
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
		if (nextItem.class == item.className) {
			var tempId = item.id;
			item.id = nextItem.id;
			nextItem.id = tempId;

			item.children[1].innerHTML = item.className + item.id;
			nextItem.children[1].innerHTML = nextItem.className + nextItem.id;
		}
	}
}