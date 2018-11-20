// Declare namespace
layout = (function (context)
{
	// Converts a string value "px" on the end, to a float value
	context.pxToFloat = function (string)
	{
		return parseFloat(string.substring(0, string.length-2));
	};

	// Creates a new button with a label and a click event
	context.createButton = function (innerHTML, clickFunction, backgroundColor)
	{
		var button = document.createElement("div");
		
		button.style.display = "table";
		button.style.height = "100%";
		// Keeps gaps between buttons and makes sure each is centered within its grid square
		button.style.width = "70%";
		button.style.margin = "0 auto";
		// Prevents text from being too close to side of button
		button.style.padding = "5%";
		
		// Create a small table cell div that holds the button text so that it can be perfectly central
		var text = document.createElement("div");
		text.innerHTML = innerHTML;
		text.style.display = "table-cell";
		text.style.verticalAlign = "middle";
		text.style.textAlign = "center";
		button.appendChild(text);
		
		// Text must always be white because black text on color buttons looks bad
		button.style.color = "white";
		button.style.backgroundColor = backgroundColor;
		button.style.borderRadius = "var(--theme-border-radius)";
		button.style.boxShadow = "var(--theme-box-shadow)";

		button.style.cursor = "pointer";
		button.addEventListener("click", clickFunction);

		return button;
	};

	// Creates a container filled with a row of buttons
	context.createButtonRow = function (buttons)
	{
		var buttonRow = document.createElement("div");
		
		buttonRow.style.marginBottom = "5vh";
		buttonRow.style.height = "10vh";
		
		buttonRow.style.display = "grid";
		buttonRow.style.gridTemplateColumns = "repeat("+buttons.length+", 1fr)";
		
		var i = 0;
		while (i < buttons.length)
		{
			buttonRow.appendChild(buttons[i]);
			i += 1;
		}
		
		return buttonRow;
	};
	// Creates an empty div with a label that will hold the buttons for a setting e.g. color scheme
	context.createSettingDiv = function (labelText)
		{
		// The container div for this section of the setting panel
		var settingDiv = document.createElement("div");
		
		// The label above the buttons
		var label = document.createElement("div");
		label.innerHTML = labelText + "<br><br><br>";
		settingDiv.appendChild(label);
		
		return settingDiv;
	};
	
	return context;
})({});