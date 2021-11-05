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
	self.createButton = function (innerHTML, clickFunction, backgroundColor, backgroundColorHover)
	{
		// Create new button element
		var button = document.createElement("div");
		
		// Define CSS styles
		button.style.display = "block";
		button.style.height = "100%";
		// Keeps gaps between buttons and makes sure each is centered within its grid square
		button.style.width = "70%";
		button.style.margin = "0 auto";

		// Prevents text from being too close to side of button
		button.style.padding = "0.5em 0.5em";

		button.style.overflow = "hidden";
		button.style.textAlign = "center";
		button.style.lineHeight = "inherit";
		
		// If text overlaps, crop it instead of stretching the button
		button.style.overflow = "hidden";
		button.style.whiteSpace = "nowrap";
		button.style.textOverflow = "ellipsis"

		// Set button text
		button.innerHTML = innerHTML;

		// Text must always be white because black text on color buttons looks bad
		button.style.color = "white";
		button.style.backgroundColor = backgroundColor;

		button.onmouseover = function() {
			this.style.backgroundColor = backgroundColorHover;
		}

		button.onmouseout = function() {
			this.style.backgroundColor = backgroundColor;
		}
		
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
		buttonRow.style.paddingBottom = "1em";
		buttonRow.style.marginBottom = "1em";
		
		buttonRow.style.height = "3em";
		buttonRow.style.lineHeight = "3em";

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
		label.style.marginBottom = "1em";
		label.innerHTML = labelText;

		settingDiv.appendChild(label);
		
		return settingDiv;
	};
	
	return self;
}();