// Declare namespace
calculator_build = function ()
{
	var self = {};
	
	// Properties define the maximum amount of rows and columns a grid item can have
	self.gridMaxRows = 6;
	self.gridMaxColumns = 6;

	// Properties define the default amount of rows and columns a grid item has when it is first created
	self.gridDefaultRows = 2;
	self.gridDefaultColumns = 2;

	// Counts increase/decrease for every item added/removed from the equation
	self.resetItemCounts = function ()
	{
		// Sets all counts to zero
		scalarCount = 0;
		gridCount = 0;
		operationCount = 0;
		bracketCount = 0;
	};
	
	// Creates a new text box for inputting values e.g. in a Scalar or Grid item
	self.createInputTextbox = function (gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd)
	{
		// Generates the new textbox element
		var inputTextbox = document.createElement("input");

		// Apply CSS styles
		inputTextbox.type = "text";
		inputTextbox.style.textAlign = "center";
		inputTextbox.style.boxSizing = "border-box";
		inputTextbox.style.width = "90%";
		inputTextbox.style.height = "90%";
		inputTextbox.style.margin = "auto auto";
		inputTextbox.style.borderWidth = 1;
		inputTextbox.style.borderStyle = "solid";

		// Apply the site wide colour theme
		inputTextbox.style.borderColor = "var(--theme-color-textbox-border)";
		inputTextbox.style.backgroundColor = "var(--theme-color-page-background)";
		inputTextbox.style.color = "var(--theme-color-text)";

		// Set the textbox position within its parent grid (allows grids of textboxes used for matrices/vectors)
		// The column position
		inputTextbox.style.gridColumnStart = gridColumnStart;
		inputTextbox.style.gridColumnEnd = gridColumnEnd;
		// The row position
		inputTextbox.style.gridRowStart = gridRowStart;
		inputTextbox.style.gridRowEnd = gridRowEnd;

		// When the text box is edited, re-evaluate the items
		inputTextbox.addEventListener("keyup", calculator_solve.evaluateItems);
		
		// Return the finished textbox element
		return inputTextbox;
	};
	
	// Creates a clickable button for use in items
	self.createItemButton = function (onclick, gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd)
	{
		// Generates the new button element
		var itemButton =  document.createElement("div");
		
		// Activate hand-shaped cursor while hovering over the button
		itemButton.style.cursor = "pointer";
		
		// Registers a click event to the button
		itemButton.addEventListener("click", onclick);
		
		// Set the button position within its parent grid
		// The column position
		itemButton.style.gridColumnStart = gridColumnStart;
		itemButton.style.gridColumnEnd = gridColumnEnd;
		// The row position
		itemButton.style.gridRowStart = gridRowStart;
		itemButton.style.gridRowEnd = gridRowEnd;
		
		// Return the finished button element
		return itemButton;
	};
	
	// Creates an icon button that can be placed within an item e.g. add column in the Grid item
	self.createIconButton = function (iconName, iconFileExtension, onclick, gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd)
	{
		// Create the new image element
		var icon = document.createElement("img");
		
		// Changes the colour of the button (black or white) depending on the site theme
		var iconColor = localStorage.getItem("themeShade");
		if (iconColor == "Light")
		{
			// Adds the "_black" ending to the icon filename that will be retrieved
			var iconColorPostfix = "_black";
		}
		else
		{
			// Adds the "_white" ending instead
			var iconColorPostfix = "_white";
		}
		
		// Fetches the correct image file based upon the icon name and theme
		icon.src = iconName + iconColorPostfix + iconFileExtension;
		
		// Apply CSS styles
		icon.style.height = "100%";
		icon.style.margin = "0 auto";

		// Activate hand-shaped cursor while hovering over the button
		icon.style.cursor = "pointer";
		
		// Registers a click event to the icon
		icon.addEventListener("click", onclick);
		
		// Set the icon position within its parent grid
		// The column position
		icon.style.gridColumnStart = gridColumnStart;
		icon.style.gridColumnEnd = gridColumnEnd;
		icon.style.gridRowStart = gridRowStart;
		icon.style.gridRowEnd = gridRowEnd;
		
		return icon;
	};
	
	// Creates a small color indicator item for use 
	self.createColorIndicator = function ()
	{
		// Creates the new div element
		var colorIndicator = document.createElement("div");
		
		// Adds the colourIndicator class so that its colour can be changed according to the state of the graph
		colorIndicator.classList.add("colorIndicator");
		
		// Curved borders to fit with the shape of the item
		colorIndicator.style.borderTopLeftRadius = "var(--theme-border-radius)";
		colorIndicator.style.borderBottomRightRadius = "var(--theme-border-radius)";
		
		// Registers the following function to its click event
		colorIndicator.addEventListener("click", function(e) {
			// Gets a DOM refernce to the colour picker element that was clicked
			var colorIndicator = e.path[0];

			// Also gets a refernce to the item the colour picker belongs to
			var item = e.path[1];
			
			// Check to see if the points belonging to this grid should be hidden
			var pointsVisible = item.getAttribute("pointsVisible");
			if (pointsVisible == "true")
			{
				// If they are visible, make the colour picker fainter
				colorIndicator.style.opacity = "0.3";
				// Set the pointsVisible attribute from true to false
				item.setAttribute("pointsVisible", "false");
				
			}
			else
			{
				// Otherwise, make the colour picker more bold
				colorIndicator.style.opacity = "1";
				// Switch the pointsVisible attribute from true to false
				item.setAttribute("pointsVisible", "true");
			}
			
			// Re-evaluate the items so that the graph is updated, and the points either become hidden or visible
			calculator_solve.evaluateItems();
		});

		// Return the finished div element
		return colorIndicator;
	};
	
	// Creates an empty box div with a shadow
	self.createEmptyBox = function ()
	{
		// Creates a new div element
		var box = document.createElement("div");
		
		// Applies the site wide them to its background
		box.style.background = "var(--theme-color-page-background-light)";
		
		// Apply CSS styles
		box.style.padding = 0;
		box.style.height = "30vh";
		box.style.marginBottom = "4vh";
		
		box.style.boxShadow = "var(--theme-box-shadow)";
		box.style.borderRadius = "var(--theme-border-radius)";
		
		box.style.animationName = "fadeIn";
		box.style.animationDuration = "0.25s";
		
		// Return the finished box element
		return box;
	};
	
	// Creates an empty item that can become a scalar, grid, operation or bracket item
	self.createEmptyItem = function (itemClass, itemCount)
	{
		// Creates a box to hold the various parts of the item
		var itemWrapper = self.createEmptyBox();

		// Sets the HTML class of the item to match the item type
		itemWrapper.className = itemClass;

		// Make its HTML id equal to the itemCount of that item type
		itemWrapper.id = itemCount;
		itemWrapper.style.display = "grid";

		// Use CSS 'fr' unit to calculate how the rows/columns should be proportioned to fit their container
		itemWrapper.style.gridTemplateColumns = "repeat(10, 1fr)";
		itemWrapper.style.gridTemplateRows = "repeat(8, 1fr)"; 
		
		// Creates a div to hold the name of the item
		var itemName = document.createElement("div");

		// Specify the position within the parent grid box
		itemName.style.gridColumnStart = 1;
		itemName.style.gridColumnEnd = 4;
		itemName.style.gridRowStart = 1;
		itemName.style.gridRowEnd = 2;

		// Apply CSS styles
		itemName.style.padding = 0;
		itemName.style.textAlign = "center";

		// Generate a name for the item based on its type and itemCount
		// Examples include: Scalar4, Grid2, Operation1
		itemName.innerHTML = itemWrapper.className + itemWrapper.id;
		
		// Adds the move and delete icon buttons to the side of the item
		itemMoveUpIcon = self.createIconButton("images/move_up", ".svg", self.moveItemUp, 2, 3, 3, 4);
		itemDeleteIcon = self.createIconButton("images/delete", ".svg", self.deleteItem, 2, 3, 5, 6);
		itemMoveDownIcon = self.createIconButton("images/move_down", ".svg", self.moveItemDown, 2, 3, 7, 8);
		
		// Append all the individual parts of the item to its container div
		itemWrapper.appendChild(itemName);
		itemWrapper.appendChild(itemMoveUpIcon);
		itemWrapper.appendChild(itemDeleteIcon);
		itemWrapper.appendChild(itemMoveDownIcon);
		
		// Toggle the clear/export buttons at the bottom the list of the equations
		self.toggleEquationFinishButtons();
		
		// Return the new empty item
		return itemWrapper;
	};
	
	// Deletes the selected item when the user clicks the delete icon
	self.deleteItem = function (event)
	{	
		// Gets parent element of the delete icon that was clicked
		var item = event["path"][1];
		
		// Update the item count, depending on the HTML class of the item clicked
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
		
		// Toggle the clear/export buttons at the bottom the list of the equations
		self.toggleEquationFinishButtons();
		
		// Gets a reference to the list of items in the equation
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
					// Moves any items below the deleted item upwards
					if (parseInt(itemDiv.children[i].id) > parseInt(item.id))
					{
						// Change id
						itemDiv.children[i].id = parseInt(itemDiv.children[i].id) - 1;
						// Change the name that is displayed
						itemDiv.children[i].children[1].innerHTML = itemDiv.children[i].className + itemDiv.children[i].id;
					}
				}

				// Iterate the counter
				i += 1;
			}
			
			// Remove the item from the item list
			item.parentNode.removeChild(item);
			
			// Re-evaluate the equation with an item now missing
			calculator_solve.evaluateItems();
		}, 200);
	};
	
	// Swap an item another item above or below
	self.moveItem = function (direction)
	{
		// Gets parent element of the delete icon that was clicked
		var item = event["path"][1];
		
		// Specify the direction of the item movement
		if (direction == "up")
		{
			// Get a reference the the item above the clicked item
			var adjacentItem = item.previousSibling;
			// If the item is at the top it cannot be moved up
			if (adjacentItem == null)
			{
				// Return without moving the item up
				return false;
			}

			// Insert the item before the previous item (1 up)
			var insertBefore = adjacentItem;
		}
		else
		{
			// Otherwise reference the item below the clicked item
			var adjacentItem = item.nextSibling;
			// If the item is at the bottom, it cannot be moved down
			if (adjacentItem == null)
			{
				// Return without moving the item down
				return false;
			}
		
			// Inser the item before the item after the next item (1 down)
			var insertBefore = adjacentItem.nextSibling;
		}
		
		// Get a reference to the item list
		var parent = item.parentNode;
		
		// Remove the item from its current position
		parent.removeChild(item);

		// If the item to be inserted before is null, we are inserting into the last position
		// Consequently we must use 'appendChild' instead of 'insertBefore'
		if (insertBefore == null)
		{
			// Adds item to the end of the item div
			parent.appendChild(item);
		}
		else
		{
			// Insert the item 1 above its previous position
			parent.insertBefore(item, insertBefore);
		}

		// Swaps id's back if items are both of the same class (e.g. both scalars)
		if (adjacentItem.className == item.className)
		{
			// Store the items current id
			var tempId = item.id;
			// Swap id's with the item above (of the same class)
			item.id = adjacentItem.id;
			adjacentItem.id = tempId;
			
			// Update the name tags of the items
			item.children[0].innerHTML = item.className + item.id;
			adjacentItem.children[0].innerHTML = adjacentItem.className + adjacentItem.id;
		}
		
		// Re-evaluate the new equation now that an item has moved
		calculator_solve.evaluateItems();
	};

	// Moves an item upwards, swapping it with the item above
	self.moveItemUp = function (event)
	{
		self.moveItem('up');
	};

	// Moves an item downwards, swapping it with the item below
	self.moveItemDown = function (event)
	{
		self.moveItem('down');
	};

	// Creates a scalar item
	self.addScalar = function ()
	{
		// Gets a DOM reference to the item div
		var itemDiv = document.getElementById("itemDiv");
		
		// Increment the count of scalar items
		scalarCount += 1;

		// Create an empty item wrapper element of type scalar
		var scalarWrapper = self.createEmptyItem("scalar", scalarCount);
		
		// Add a textbox to hold the value of the scalar
		var scalarTextbox = self.createInputTextbox(4, 5, 2, 3);
		scalarWrapper.appendChild(scalarTextbox);
		
		// Add the new item to the list of items in the equation (the item div)
		itemDiv.appendChild(scalarWrapper);
		
		// Re-evaluate the equation with the new scalar item
		calculator_solve.evaluateItems();
	};
	
	// Creates a grid item
	self.addGrid = function ()
	{
		// Gets a DOM reference to the item div
		var itemDiv = document.getElementById("itemDiv");
		
		// Increment the count of grid items
		gridCount += 1;

		// Create an empty item wrapper element of type grid
		var gridWrapper = self.createEmptyItem("grid", gridCount);

		// By default, set its points on the graph to be visible
		gridWrapper.setAttribute("pointsVisible", "true");
		
		// Adds a grid of textboxes to hold numerical values (representing matrix/scalar elements)
		// Iterate throught each row
		var r = 0;
		while (r < self.gridMaxRows - 1)
		{
			// Iterate through each column position in the current row
			var c = 0;
			while (c < self.gridMaxRows - 1)
			{
				// Create a textbox element at the current position in the grid
				var gridElementTextbox = self.createInputTextbox(4+c, 5+c, 2+r, 3+r);

				// By default, hide any rows or elements so only a 2x2 grid shows
				if (r > self.gridDefaultRows - 1 || c > self.gridDefaultColumns - 1)
				{
					// Set the textboxes CSS to make it hidden
					gridElementTextbox.style.visibility = "hidden";
				}
				
				// Append the new textbox the the grid element
				gridWrapper.appendChild(gridElementTextbox);
				
				// Move to the next column
				c += 1;
			}
			
			// Move to the next row
			r += 1;
		}
		
		// Set the rows and columns HTML DOM attributes accordingly 
		gridWrapper.setAttribute("rows", self.gridDefaultRows);
		gridWrapper.setAttribute("columns", self.gridDefaultColumns);
		
		// Create icon buttons for adding and removing rows
		var addGridRowIcon = self.createIconButton("images/add", ".svg", self.addGridRow, 4, 5, 8, 9);
		var removeGridRowIcon = self.createIconButton("images/remove", ".svg", self.removeGridRow, 5, 6, 8, 9);
		// And also for adding and removing columns
		var addGridColumnIcon = self.createIconButton("images/add", ".svg", self.addGridColumn, 10, 11, 2, 3);
		var removeGridColumnIcon = self.createIconButton("images/remove", ".svg", self.removeGridColumn, 10, 11, 3, 4);
		
		// Append all these icon buttons to the grid item wrapper
		gridWrapper.appendChild(addGridRowIcon);
		gridWrapper.appendChild(removeGridRowIcon);
		gridWrapper.appendChild(addGridColumnIcon);
		gridWrapper.appendChild(removeGridColumnIcon);
		
		// Create a new colour indicator to link each grid item to the points it represents on the graph
		var colorIndicator = self.createColorIndicator();

		// Specify its position in the grid item (bottom right corner)
		colorIndicator.style.gridColumnStart = 10;
		colorIndicator.style.gridColumnEnd = 11;
		colorIndicator.style.gridRowStart = 8;
		colorIndicator.style.gridRowEnd = 9;

		// Append the indicator to the grid item
		gridWrapper.appendChild(colorIndicator);
		
		// Add the new grid item to the list of items in the equation (the item div)
		itemDiv.appendChild(gridWrapper);
		
		// Re-evaluate the equation with the new grid item
		calculator_solve.evaluateItems();
	};
	
	// Adds a new row to a grid item
	self.addGridRow = function ()
	{
		// Get a DOM reference to the grid item clicked
		var gridWrapper = event["path"][1];

		// Get the number of rows and columns as integer values
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		// If there is room to add another row
		if (rows < self.gridMaxRows - 1)
		{
			// Make all textboxes from the row below the bottom row visible
			var c = 0;
			while (c < columns)
			{
				elementNumber = (self.gridMaxColumns - 1)*rows + c + 5
				gridWrapper.children[elementNumber].style.visibility = "";

				c += 1;
			}
			
			// Increment the rows DOM attribute
			gridWrapper.setAttribute("rows", rows+1)
		}
		
		// Re-evaluate the equation with the updated grid dimensions
		calculator_solve.evaluateItems();
	};
	
	// Removes a row from the grid item
	self.removeGridRow = function ()
	{
		// Get a DOM reference to the grid item clicked
		var gridWrapper = event["path"][1];

		// Get the number of rows and columns as integer values
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		// If a row can be removed
		if (rows > 1)
		{
			var c = 0;
			while (c < columns)
			{
				elementNumber = (self.gridMaxRows - 1)*(rows-1) + c + 5
				gridWrapper.children[elementNumber].style.visibility = "hidden";

				c += 1;
			}
			
			// Decrement the rows DOM attribute
			gridWrapper.setAttribute("rows", rows-1)
		}
		
		// Re-evaluate the equation with the updated grid dimensions
		calculator_solve.evaluateItems();
	};

	// Adds a new column to a grid item
	self.addGridColumn = function ()
	{
		// Get a DOM reference to the grid item clicked
		var gridWrapper = event["path"][1];

		// Get the number of rows and columns as integer values
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		// If there is room to add another column
		if (columns < self.gridMaxColumns - 1)
		{
			// Make all textboxes from the column to the right of the right-most column visible
			var r = 0;
			while (r < rows)
			{
				elementNumber = (self.gridMaxColumns - 1)*r + columns + 5
				gridWrapper.children[elementNumber].style.visibility = "";

				r += 1;
			}
			
			// Increment the columns DOM attribute
			gridWrapper.setAttribute("columns", columns+1)
		}
		
		// Re-evaluate the equation with the updated grid dimensions
		calculator_solve.evaluateItems();
	};

	// Removes a column from the grid item
	self.removeGridColumn = function ()
	{
		// Get a DOM reference to the grid item clicked
		var gridWrapper = event["path"][1];

		// Get the number of rows and columns as integer values
		var rows = parseInt(gridWrapper.getAttribute("rows"));
		var columns = parseInt(gridWrapper.getAttribute("columns"));
		
		// If a column can be removed
		if (columns > 1)
		{
			// Hide all textboxes from the right-most column
			var r = 0;
			while (r < rows)
			{
				elementNumber = (self.gridMaxRows - 1)*r + (columns-1) + 5
				gridWrapper.children[elementNumber].style.visibility = "hidden";

				r += 1;
			}
			
			// Decrement the columns DOM attribute
			gridWrapper.setAttribute("columns", columns-1);
		}
		
		// Re-evaluate the equation with the updated grid dimensions
		calculator_solve.evaluateItems();
	};

	// Creates a selectable button in an item, for selecting one value out of many
	self.createSelectableButton = function (innerHTML, verticalPosition, horizontalPosition)
	{
		// Create a new button element
		var button = document.createElement("div");
		
		// Add the HTML class of selectionButton
		// This makes it easier to locate when retrieving its value
		button.className = "selectionButton";

		// Set the text of the button as specified
		button.innerHTML = innerHTML;

		// Apply CSS styles to the button
		button.style.height = "90%";
		button.style.width = "90%";
		button.style.margin = "auto auto";
		button.style.boxSizing = "border-box";
		button.style.textAlign = "center";
		button.style.fontSize = "90%";
		button.style.overflow = "hidden";
		
		button.style.borderWidth = 1;
		button.style.borderStyle = "solid";
		
		// Apply the site wide theme to the button
		button.style.borderColor = "var(--theme-color-textbox-border)";
		button.style.backgroundColor = "var(--theme-color-page-background)";
		
		// Activate hand-shaped cursor while hovering over the button
		button.style.cursor = "pointer";
		
		// When the selectable button is changed, update the current selection to reflect what was clicked
		button.addEventListener("click", self.selectButton);
		// Also re-evaluate the equation, because an item has now changed
		button.addEventListener("click", calculator_solve.evaluateItems);
		
		// Specify the position of the button
		button.style.gridColumnStart = 4+horizontalPosition;
		button.style.gridColumnEnd = 5+horizontalPosition;
		button.style.gridRowStart = 2+verticalPosition;
		button.style.gridRowEnd = 3+verticalPosition;
		
		// Return the new selectable button element
		return button;
	};

	// Adds a grid pattern of selectable buttons to an item, based on an array containing their labels
	self.createSeletableButtonGrid = function(buttonList, itemWrapper)
	{
		// Loop throught each row of buttons (v for vertical)
		var v = 0;
		while (v < buttonList.length)
		{
			// Loop through each indiviual button label (h for horizontal)
			var h = 0;
			while (h < buttonList[v].length)
			{
				// Create a selectable button with the corresponding label
				var button = self.createSelectableButton(buttonList[v][h], v, h);
				// Add the seletable button to the item wrapper
				itemWrapper.appendChild(button);
				
				// Move onto the next button in the row
				h += 1;
			}
			
			// Move onto the next row
			v += 1;
		}
	};

	// Creates a operation item
	self.addOperation = function ()
	{
		// Get a DOM reference to the item div
		var itemDiv = document.getElementById("itemDiv");
		
		// Increment the counter for operation items
		operationCount += 1;

		// Create an empty item wrapper element of type operation
		var operationWrapper = self.createEmptyItem("operation", operationCount);
		
		// A 2 dimensional array holding the lables (and positions) for all the selectable buttons
		// Each button corresponds to a single operation
		var buttonList = [["+","-","X","/","^","!"],["Sin","Cos","Tan","Asin","Acos","Atan"],["Log","Ln","P","C","Mag"],["Det","Tra","Mins","Cof","Adj","Inv"], ["Min","Norm","Angl","Dot","Cross"]];

		// Creates the grid of selectable operation buttons from the list of labels
		self.createSeletableButtonGrid(buttonList, operationWrapper);
		
		// Append the new operation item to the list of items (item div)
		itemDiv.appendChild(operationWrapper);
		
		// Re-evaluate the equation with the new operation item
		calculator_solve.evaluateItems();
	};

	// Creates a bracket item
	self.addBracket = function ()
	{
		// Get a DOM reference to the item div
		var itemDiv = document.getElementById("itemDiv");
	
		// Increment the counter for bracket items
		bracketCount += 1;

		// Create an empty item wrapper element of type bracket
		var bracketWrapper = self.createEmptyItem("bracket", bracketCount);

		// A 2 dimensional array holding the lables (and positions) for all the selectable buttons
		// Each button corresponds to a single bracket type
		var buttonList = [["(",")"],["[","]"]];
		
		// Creates the grid of selectable bracket buttons from the list of labels
		self.createSeletableButtonGrid(buttonList, bracketWrapper);
		
		// Append the new bracket item to the list of items (item div)
		itemDiv.appendChild(bracketWrapper);
		
		// Re-evaluate the equation with the new bracket item
		calculator_solve.evaluateItems();
	};
	
	// Changes the function/operator of an Operation item based on user mouse click
	self.selectButton = function (event)
	{
		// Gets a DOM reference to the button that was clicked
		var selectedButton = event["path"][0];
		
		// Resets all the other buttons so that they are unselected
		var i = 0;
		while (i < selectedButton.parentNode.children.length)
		{
			if (selectedButton.parentNode.children[i].className == "selectionButton")
			{
				// Sets the colour to be the same as ordinary text, with an identical colour background to the page
				selectedButton.parentNode.children[i].style.borderColor = "var(--theme-color-textbox-border)";
				selectedButton.parentNode.children[i].style.backgroundColor = "var(--theme-color-page-background)";
			}
			
			// Move onto the next item
			i += 1;
		}
		
		// Hilights the selected button with the main color
		// Its background main theme colour with a darker border
		selectedButton.style.borderColor = "var(--theme-color-main)";
		selectedButton.style.backgroundColor = "var(--theme-color-main-light)";
		
		// Sets the value attribute of the item to that of the (currently selected) button
		selectedButton.parentNode.setAttribute("value", selectedButton.innerHTML);
	};
	
	// Shows/hides the "export" and "clear" buttons at the bottom of the equation div
	// They are hidden if there are no items, otherwise they are visible
	self.toggleEquationFinishButtons = function ()
	{
		// Get a DOM refence to the finish button div
		var equationFinishButtonDiv = document.getElementById("equationFinishButtonDiv");
		
		// If there are no items, dont show the finish "solve" and "export" buttons
		if (scalarCount == 0 && gridCount == 0 && operationCount == 0 && bracketCount == 0)
		{
			// Resets the animation so it can be played again
			equationFinishButtonDiv.style.animationName = "fadeOut";
			// Hide the item slightly later (to allow the animation to finish)
			// Also cancel its animation
			setTimeout(function ()
			{
				equationFinishButtonDiv.style.animationName = "";
				equationFinishButtonDiv.style.visibility = "hidden";
			},200);
		}
		// Otherwise show them
		else
		{
			// Make the div visible again
			equationFinishButtonDiv.style.visibility = "";
			// Plays the animation
			equationFinishButtonDiv.style.animationName = "fadeIn";
			
		}
	};
	
	return self;
}();