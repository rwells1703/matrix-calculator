// Declare namespace
settings = (function (context)
{
	// Gets the label of the button that was pressed as text. Necessary because the buttons have padding and clicking inside the padding vs clicking outside, causes different click events to be registered.
	context.getButtonValue = function (clickEvent)
	{
		// If the user clicks directly on the button label, take the value from there
		if (event["path"][0].style.display == "table-cell")
		{
			return event["path"][0].innerHTML;
		}
		// Otherwise, the user clicked on the button padding, so we must take the value from its child, the label
		return event["path"][0].children[0].innerHTML;
	};

	// Updates the color aspect of theme
	context.updateColor = function (event)
	{
		var value = context.getButtonValue(event)
		theme.setColor(value);
	};

	// Updates the shade aspect of theme
	context.updateShade = function (event)
	{
		var value = context.getButtonValue(event)
		theme.setShade(value);
	};

	// Updates the style aspect of theme
	context.updateStyle = function (event)
	{
		var value = context.getButtonValue(event)
		theme.setStyle(value);
	};

	// Updates the calculator layout aspect of theme
	context.updateCalculatorLayout = function (event)
	{
		var value = context.getButtonValue(event)
		theme.setCalculatorLayout(value);
	};
	
	// Creates 3 seperate, labelled rows of buttons for each theme setting
	context.createThemeButtons = function (event)
	{
		// The color label above the buttons
		var colorLabel = document.createElement("div");
		colorLabel.innerHTML = "Color<br><br><br>";
		mainDiv.appendChild(colorLabel);

		// The first row of color buttons
		var themeColorButtonsTop = [];
		themeColorButtonsTop.push(layout.createButton("Ruby Red", context.updateColor, theme.colors["Ruby Red"]["color-main"]));
		themeColorButtonsTop.push(layout.createButton("Sapphire Blue", context.updateColor, theme.colors["Sapphire Blue"]["color-main"]));
		themeColorButtonsTop.push(layout.createButton("Amber Yellow", context.updateColor, theme.colors["Amber Yellow"]["color-main"]));
		themeColorButtonTopDiv = layout.createButtonRow(themeColorButtonsTop);

		// The second row of color buttons
		var themeColorButtonsBottom = [];
		themeColorButtonsBottom.push(layout.createButton("Slate Grey", context.updateColor, theme.colors["Slate Grey"]["color-main"]));
		themeColorButtonsBottom.push(layout.createButton("Amethyst Purple", context.updateColor, theme.colors["Amethyst Purple"]["color-main"]));
		themeColorButtonsBottom.push(layout.createButton("Emerald Green", context.updateColor, theme.colors["Emerald Green"]["color-main"]));
		themeColorButtonBottomDiv = layout.createButtonRow(themeColorButtonsBottom);

		// Add the color buttons to the mainDiv
		mainDiv.appendChild(themeColorButtonTopDiv);
		mainDiv.appendChild(themeColorButtonBottomDiv);


		// The shade label above the buttons
		var shadeLabel = document.createElement("div");
		shadeLabel.innerHTML = "Shade<br><br><br>";
		mainDiv.appendChild(shadeLabel);

		// The shade buttons
		var themeShadeButtons = [];
		themeShadeButtons.push(layout.createButton("Light", context.updateShade, "var(--theme-color-main)"));
		themeShadeButtons.push(layout.createButton("Dark", context.updateShade, "var(--theme-color-main)"));
		themeShadeButtonDiv = layout.createButtonRow(themeShadeButtons);

		// Add the shade buttons to the mainDiv
		mainDiv.appendChild(themeShadeButtonDiv);


		// The style label above the buttons
		var styleLabel = document.createElement("div");
		styleLabel.innerHTML = "Style<br><br><br>";
		mainDiv.appendChild(styleLabel);

		// The style buttons
		var themeStyleButtons = [];
		themeStyleButtons.push(layout.createButton("Material", context.updateStyle, "var(--theme-color-main)"));
		themeStyleButtons.push(layout.createButton("Flat", context.updateStyle, "var(--theme-color-main)"));
		themeShadeButtonDiv = layout.createButtonRow(themeStyleButtons);

		// Add the style buttons to the mainDiv
		mainDiv.appendChild(themeShadeButtonDiv);
		
		
		// The calculator layout label above the buttons
		var calculatorLayoutLabel = document.createElement("div");
		calculatorLayoutLabel.innerHTML = "Calculator Layout<br><br><br>";
		mainDiv.appendChild(calculatorLayoutLabel);

		// The calculator layout buttons
		var themeCalculatorLayoutButtons = [];
		themeCalculatorLayoutButtons.push(layout.createButton("Equation before graph", context.updateCalculatorLayout, "var(--theme-color-main)"));
		themeCalculatorLayoutButtons.push(layout.createButton("Graph before equation", context.updateCalculatorLayout, "var(--theme-color-main)"));
		themeCalculatorLayoutButtonDiv = layout.createButtonRow(themeCalculatorLayoutButtons);

		// Add the calculator layout buttons to the mainDiv
		mainDiv.appendChild(themeCalculatorLayoutButtonDiv);
	};
	
	return context;
})({});