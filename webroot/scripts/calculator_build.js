// Declare namespace
calculator_build = function ()
{
	var self = {};
	
	// Counts increase/decrease for every item added/removed from the equation
	self.setItemCounts = function ()
	{
		scalarCount = 0;
		gridCount = 0;
		operationCount = 0;
		bracketCount = 0;
	};

	// Creates a new text box for inputting values e.g. in a Scalar or Grid item
	self.createInputTextbox = function (gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd)
	{
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

		inputTextbox.style.gridColumnStart = gridColumnStart;
		inputTextbox.style.gridColumnEnd = gridColumnEnd;
		inputTextbox.style.gridRowStart = gridRowStart;
		inputTextbox.style.gridRowEnd = gridRowEnd;
		
		return inputTextbox;
	};

	// Creates an icon button that can be placed within an item e.g. add column in the Grid item
	self.createIconButton = function (src, onclick, gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd)
	{
		var iconButton = document.createElement("img");

		iconButton.src = src;
		iconButton.onclick = onclick;

		iconButton.style.cursor = "pointer";
		iconButton.style.height = "100%";
		iconButton.style.margin = "0 auto";

		iconButton.style.gridColumnStart = gridColumnStart;
		iconButton.style.gridColumnEnd = gridColumnEnd;
		iconButton.style.gridRowStart = gridRowStart;
		iconButton.style.gridRowEnd = gridRowEnd;
		
		return iconButton;
	};
	
	// Creates an empty item that can become a scalar, grid, operation or bracket item
	self.createEmptyItem = function (itemClass, itemCount)
	{
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

		itemMoveUpIcon = self.createIconButton("images/move_up.svg", self.moveItemUp, 2, 3, 4, 5);
		itemDeleteIcon = self.createIconButton("images/delete.svg", self.deleteItem, 2, 3, 6, 7);
		itemMoveDownIcon = self.createIconButton("images/move_down.svg", self.moveItemDown, 2, 3, 8, 9);

		itemWrapper.appendChild(itemSidebar);
		itemWrapper.appendChild(itemName);
		itemWrapper.appendChild(itemMoveUpIcon);
		itemWrapper.appendChild(itemDeleteIcon);
		itemWrapper.appendChild(itemMoveDownIcon);
		
		self.toggleEquationFinishButtons();
		
		return itemWrapper;
	};
	
	// Deletes the selected item when the user clicks the delete icon
	self.deleteItem = function (event)
	{
		// Gets parent element of the delete icon that was clicked
		var item = event["path"][1];
		
		if (item.className == "scalar")
		{
			scalarCount -= 1;
		}
		else if (item.className == "grid")
		{
			gridCount -= 1;
		}
		else if (item.className == "operation")
		{
			operationCount -= 1;
		}
		else
		{
			bracketCount -= 1;
		}
		
		// Animates the removal of the item
		item.style.animationName = "fadeOut";
		
		self.toggleEquationFinishButtons();
		
		var itemDiv = document.getElementById("itemDiv");
		
		// Deletes the item 200ms later so that deletion occurs slightly before animation ends (prevents flicker)
		setTimeout(function ()
		{
			// Changes id, name and count so that each item is still in order
			var i = 0;
			while (i < itemDiv.children.length)
			{
				// Only change item ids of items with the same class
				if (itemDiv.children[i].className == item.className)
				{
					if (parseInt(itemDiv.children[i].id) > parseInt(item.id))
					{
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
	self.moveItemUp = function (event)
	{
		var item = event["path"][0].parentNode;
		var previousItem = item.previousSibling;
		
		if (previousItem != null)
		{
			var parent = item.parentNode;
			
			parent.removeChild(item);
			parent.insertBefore(item, previousItem);
			
			// Swaps id's back if items are both of the same class (e.g. both scalars)
			if (previousItem.className == item.className)
			{
				var tempId = item.id;
				item.id = previousItem.id;
				previousItem.id = tempId;
				
				item.children[1].innerHTML = item.className + item.id;
				previousItem.children[1].innerHTML = previousItem.className + previousItem.id;
			}
		}
	};

	// Moves an item downwards in the equation, swapping it with the item below
	self.moveItemDown = function (event)
	{
		var item = event["path"][0].parentNode;
		var nextItem = item.nextSibling;
		
		if (nextItem != null)
		{
			var parent = item.parentNode;
			
			parent.removeChild(item);
			
			// If removing the item before last, it must be re-inserted as the last item
			// Because it is the item before last, nextItem.nextSibling will be null meaning we have to use parent.appendChild instead of parent.insertBefore
			if (nextItem.nextSibling == null)
			{
				parent.appendChild(item);
			}
			else
			{
				parent.insertBefore(item, nextItem.nextSibling);
			}
			
			// Swaps id's back if items are both of the same class (e.g. both scalars)
			if (nextItem.className == item.className)
			{
				var tempId = item.id;
				item.id = nextItem.id;
				nextItem.id = tempId;

				item.children[1].innerHTML = item.className + item.id;
				nextItem.children[1].innerHTML = nextItem.className + nextItem.id;
			}
		}
	};

	// Creates a scalar item
	self.addScalar = function ()
	{
		var itemDiv = document.getElementById("itemDiv");
		
		scalarCount += 1;
		var scalarWrapper = self.createEmptyItem("scalar", scalarCount);
		
		var scalarTextbox = self.createInputTextbox(4, 5, 2, 3);
		scalarWrapper.appendChild(scalarTextbox);
		itemDiv.appendChild(scalarWrapper);
	};

	// Creates a grid item
	self.addGrid = function ()
	{
		var itemDiv = document.getElementById("itemDiv");
		
		gridCount += 1;
		var gridWrapper = self.createEmptyItem("grid", gridCount);
		
		var r = 0;
		while (r < 7)
		{
			var c = 0;
			while (c < 7)
			{
				var gridElementTextbox = self.createInputTextbox(4+c, 5+c, 2+r, 3+r);
				gridWrapper.appendChild(gridElementTextbox);
				
				// Hide any rows or elements so only a 2x2 grid shows
				if (r > 1 || c > 1)
				{
					gridWrapper.lastChild.style.visibility = "hidden";
				}
				
				c += 1;
			}
			
			r += 1;
		}
		
		gridWrapper.setAttribute("rows", 2);
		gridWrapper.setAttribute("columns", 2);

		addGridRowIcon = self.createIconButton("images/add.svg", self.addGridRow, 4, 5, 9, 10);
		removeGridRowIcon = self.createIconButton("images/remove.svg", self.removeGridRow, 5, 6, 9, 10);
		addGridColumnIcon = self.createIconButton("images/add.svg", self.addGridColumn, 11, 12, 2, 3);
		removeGridColumnIcon = self.createIconButton("images/remove.svg", self.removeGridColumn, 11, 12, 3, 4);

		gridWrapper.appendChild(addGridRowIcon);
		gridWrapper.appendChild(removeGridRowIcon);
		gridWrapper.appendChild(addGridColumnIcon);
		gridWrapper.appendChild(removeGridColumnIcon);
		
		itemDiv.appendChild(gridWrapper);
	};
	
	// Adds a new row to a grid item
	self.addGridRow = function ()
	{
		var gridWrapper = event["path"][1];
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		if (rows < 6)
		{
			var c = 0;
			while (c < columns)
			{
				elementNumber = 7*rows + c + 5
				gridWrapper.children[elementNumber].style.visibility = "";
				c += 1;
			}
			
			gridWrapper.setAttribute("rows", rows+1)
		}
	};
	
	// Removes a row from the grid item
	self.removeGridRow = function ()
	{
		var gridWrapper = event["path"][1];
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		if (rows > 1)
		{
			var c = 0;
			while (c < columns)
			{
				elementNumber = 7*(rows-1) + c + 5
				gridWrapper.children[elementNumber].style.visibility = "hidden";
				c += 1;
			}
			
			gridWrapper.setAttribute("rows", rows-1)
		}
	};

	// Adds a new column to a grid item
	self.addGridColumn = function ()
	{
		var gridWrapper = event["path"][1];
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		if (columns < 6)
		{
			var r = 0;
			while (r < rows)
			{
				elementNumber = 7*r + columns + 5
				gridWrapper.children[elementNumber].style.visibility = "";
				r += 1;
			}
			
			gridWrapper.setAttribute("columns", columns+1)
		}
	};

	// Removes a column from the grid item
	self.removeGridColumn = function ()
	{
		var gridWrapper = event["path"][1];
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		if (columns > 1)
		{
			var r = 0;
			while (r < rows)
			{
				elementNumber = 7*r + (columns-1) + 5
				gridWrapper.children[elementNumber].style.visibility = "hidden";
				r += 1;
			}
			
			gridWrapper.setAttribute("columns", columns-1);
		}
	};

	// Creates a selectable button in an item, for selecting one value out of many
	self.createSelectableButton = function (innerHTML, positionsFromLeft)
	{
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
		button.onclick = self.selectButton;
		
		var buttonsPerRow = 6;
		button.style.gridColumnStart = 4+(positionsFromLeft % buttonsPerRow);
		button.style.gridColumnEnd = 5+(positionsFromLeft % buttonsPerRow);
		button.style.gridRowStart = 2+Math.floor(positionsFromLeft / buttonsPerRow);
		button.style.gridRowEnd = 3+Math.floor(positionsFromLeft / buttonsPerRow);
		
		return button;
	};

	// Creates a operation item
	self.addOperation = function ()
	{
		var itemDiv = document.getElementById("itemDiv");
		
		operationCount += 1;
		var operationWrapper = self.createEmptyItem("operation", operationCount);
		
		var buttonList = ["+", "-", "*", "/", "^", "&middot", "x", "p", "c", "!", "Sin", "Cos", "Tan", "Asin", "Acos", "Atan", "Log", "Ln", "T", "Det", "Min", "Mins", "Cof", "Adj", "Inv", "Angle", "Mag", "Norm"];
		
		var i = 0;
		while (i < buttonList.length)
		{
			var button = self.createSelectableButton(buttonList[i], i);
			operationWrapper.appendChild(button);
			
			i += 1;
		}
		
		itemDiv.appendChild(operationWrapper);
	};

	// Creates a bracket item
	self.addBracket = function ()
	{
		var itemDiv = document.getElementById("itemDiv");
		
		bracketCount += 1;
		var bracketWrapper = self.createEmptyItem("bracket", bracketCount);
		
		var buttonList = ["(",")","[","]"];
		
		var i = 0;
		while (i < buttonList.length)
		{
			var button = self.createSelectableButton(buttonList[i], i);
			bracketWrapper.appendChild(button);
			
			i += 1;
		}
		
		itemDiv.appendChild(bracketWrapper);
	};

	// Changes the function/operator of an Operation item based on user mouse click
	self.selectButton = function (event)
	{
		var selectedButton = event["path"][0];
		
		// Resets all the other buttons so that they are unselected
		var i = 0;
		while (i < selectedButton.parentNode.children.length)
		{
			if (selectedButton.parentNode.children[i].className == "selectionButton")
			{
				selectedButton.parentNode.children[i].style.borderColor = "var(--theme-color-textbox-border)";
				selectedButton.parentNode.children[i].style.backgroundColor = "var(--theme-color-page-background)";
			}
			
			i += 1;
		}
		
		// Hilights the selected button with the main color
		selectedButton.style.borderColor = "var(--theme-color-main)";
		selectedButton.style.backgroundColor = "var(--theme-color-main-light)";
		
		// Sets the value attribute of the Operation item
		selectedButton.parentNode.setAttribute("value", selectedButton.innerHTML);
	};
	
	// Shows/hides the "solve" and "export" buttons at the bottom of the equation div
	// They are hidden if there are no items, otherwise they are visible
	self.toggleEquationFinishButtons = function ()
	{
		var equationFinishButtonDiv = document.getElementById("equationFinishButtonDiv");
		
		if (scalarCount == 0 && gridCount == 0 && operationCount == 0 && bracketCount == 0)
		{
			// If there are no items, dont show the finish "solve" and "export" buttons
			// Resets the animation so it can be played again
			equationFinishButtonDiv.style.animationName = "fadeOut";
			setTimeout(function ()
			{
				equationFinishButtonDiv.style.animationName = "";
				equationFinishButtonDiv.style.visibility = "hidden";
			},200);
		}
		else
		{
			// Otherwise show them
			// Plays the animation again
			equationFinishButtonDiv.style.animationName = "fadeIn";
			equationFinishButtonDiv.style.visibility = "";
		}
	};
	
	return self;
}();