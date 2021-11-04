// Declare namespace
layout = function ()
{
	var self = {};
	
	// Converts a string value "px" on the end, to a float value
	self.pxToFloat = function (string)
	{
		return parseFloat(string.substring(0, string.length-2));
	};

	// Creates a new button with a label and a click event
	self.createButton = function (innerHTML, clickFunction, backgroundColor)
	{
		// Create new button element
		var button = document.createElement("div");
		
		// Define CSS styles
		button.style.display = "table";
		button.style.height = "100%";
		// Keeps gaps between buttons and makes sure each is centered within its grid square
		button.style.width = "70%";
		button.style.margin = "0 auto";
		// Prevents text from being too close to side of button
		button.style.padding = "2.5vh";
		
		// Create a small table cell div that holds the button text so that it can be perfectly central
		var text = document.createElement("div");
		text.innerHTML = innerHTML;
		text.style.display = "table-cell";
		text.style.verticalAlign = "middle";
		text.style.textAlign = "center";
		// Append the text to the button element
		button.appendChild(text);
		
		// Text must always be white because black text on color buttons looks bad
		button.style.color = "white";
		button.style.backgroundColor = backgroundColor;

		// Apply site wide theme to the button
		button.style.borderRadius = "var(--theme-border-radius)";
		button.style.boxShadow = "var(--theme-box-shadow)";

		// Activate hand-shaped cursor while hovering over the button
		button.style.cursor = "pointer";

		// Registers a click event to the button
		button.addEventListener("click", clickFunction);

		return button;
	};

	// Creates a container filled with a row of buttons
	self.createButtonRow = function (buttons)
	{
		var buttonRow = document.createElement("div");
		
		// Defines CSS styles
		buttonRow.style.marginBottom = "10vh";
		buttonRow.style.height = "10vh";
		
		// Creates a repeating grid where each button occupies one cell
		buttonRow.style.display = "grid";
		buttonRow.style.gridTemplateColumns = "repeat("+buttons.length+", minmax(0, 1fr))";
		
		// Loop through each button
		var i = 0;
		while (i < buttons.length)
		{
			// Add the button the main button row element
			buttonRow.appendChild(buttons[i]);

			// Next button
			i += 1;
		}
		
		return buttonRow;
	};
	
	// Creates an empty div with a label that will hold the buttons for a setting e.g. color scheme
	self.createSettingDiv = function (labelText)
		{
		// The container div for this section of the setting panel
		var settingDiv = document.createElement("div");
		
		// The label above the buttons
		var label = document.createElement("div");
		label.innerHTML = labelText + "<br><br><br>";
		settingDiv.appendChild(label);
		
		return settingDiv;
	};
	
	return self;
}();