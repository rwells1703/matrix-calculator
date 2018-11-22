// Declare namespace
settings = function ()
{
	var self = {};
	
	// Gets the label of the button that was pressed as text. Necessary because the buttons have padding and clicking inside the padding vs clicking outside, causes different click events to be registered.
	self.getButtonValue = function (clickEvent)
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
	self.updateColor = function (event)
	{
		var value = self.getButtonValue(event)
		theme.setColor(value);
	};

	// Updates the shade aspect of theme
	self.updateShade = function (event)
	{
		var value = self.getButtonValue(event)
		theme.setShade(value);
	};

	// Updates the style aspect of theme
	self.updateStyle = function (event)
	{
		var value = self.getButtonValue(event)
		theme.setStyle(value);
	};

	// Updates the calculator layout aspect of theme
	self.updateCalculatorLayout = function (event)
	{
		var value = self.getButtonValue(event)
		theme.setCalculatorLayout(value);
	};
	
	// Updates the angle unit aspect of theme
	self.updateAngleUnit = function (event)
	{
		var value = self.getButtonValue(event)
		theme.setAngleUnit(value);
	};
	
	// Creates seperate, labelled rows of buttons for each theme setting
	self.createThemeButtons = function (event)
	{
		// Create a color setting
		var themeColorDiv = layout.createSettingDiv("Color");
		
		// The first row of color buttons
		var themeColorButtonsTop = [];
		themeColorButtonsTop.push(layout.createButton("Ruby Red", self.updateColor, theme.colors["Ruby Red"]["color-main"]));
		themeColorButtonsTop.push(layout.createButton("Sapphire Blue", self.updateColor, theme.colors["Sapphire Blue"]["color-main"]));
		themeColorButtonsTop.push(layout.createButton("Amber Yellow", self.updateColor, theme.colors["Amber Yellow"]["color-main"]));
		themeColorButtonTopDiv = layout.createButtonRow(themeColorButtonsTop);

		// The second row of color buttons
		var themeColorButtonsBottom = [];
		themeColorButtonsBottom.push(layout.createButton("Slate Grey", self.updateColor, theme.colors["Slate Grey"]["color-main"]));
		themeColorButtonsBottom.push(layout.createButton("Amethyst Purple", self.updateColor, theme.colors["Amethyst Purple"]["color-main"]));
		themeColorButtonsBottom.push(layout.createButton("Emerald Green", self.updateColor, theme.colors["Emerald Green"]["color-main"]));
		themeColorButtonBottomDiv = layout.createButtonRow(themeColorButtonsBottom);

		// Add the color buttons to the themeColorDiv
		themeColorDiv.appendChild(themeColorButtonTopDiv);
		themeColorDiv.appendChild(themeColorButtonBottomDiv);
		// Add the themeColorDiv to the mainDiv
		mainDiv.appendChild(themeColorDiv);

		
		// Create a shade setting
		var themeShadeDiv = layout.createSettingDiv("Shade");

		// The shade buttons
		var themeShadeButtons = [];
		themeShadeButtons.push(layout.createButton("Light", self.updateShade, "var(--theme-color-main)"));
		themeShadeButtons.push(layout.createButton("Dark", self.updateShade, "var(--theme-color-main)"));
		themeShadeButtonDiv = layout.createButtonRow(themeShadeButtons);

		// Add the shade buttons to the themeShadeDiv
		themeShadeDiv.appendChild(themeShadeButtonDiv);
		// Add the themeShadeDiv to the mainDiv
		mainDiv.appendChild(themeShadeDiv);

		
		// Create a style setting
		var themeStyleDiv = layout.createSettingDiv("Style");

		// The style buttons
		var themeStyleButtons = [];
		themeStyleButtons.push(layout.createButton("Material", self.updateStyle, "var(--theme-color-main)"));
		themeStyleButtons.push(layout.createButton("Flat", self.updateStyle, "var(--theme-color-main)"));
		themeStyleButtonDiv = layout.createButtonRow(themeStyleButtons);

		// Add the style buttons to the themeStyleDiv
		themeStyleDiv.appendChild(themeStyleButtonDiv);
		// Add the themeStyleDiv to the mainDiv
		mainDiv.appendChild(themeStyleDiv);
		
		
		// Create a calculator layout setting
		var themeCalculatorLayoutDiv = layout.createSettingDiv("Calculator Layout");

		// The calculator layout buttons
		var themeCalculatorLayoutButtons = [];
		themeCalculatorLayoutButtons.push(layout.createButton("Equation before graph", self.updateCalculatorLayout, "var(--theme-color-main)"));
		themeCalculatorLayoutButtons.push(layout.createButton("Graph before equation", self.updateCalculatorLayout, "var(--theme-color-main)"));
		themeCalculatorLayoutButtonDiv = layout.createButtonRow(themeCalculatorLayoutButtons);

		// Add the calculator layout buttons to the themeCalculatorLayoutDiv
		themeCalculatorLayoutDiv.appendChild(themeCalculatorLayoutButtonDiv);
		// Add the themeCalculatorLayoutDiv to the mainDiv
		mainDiv.appendChild(themeCalculatorLayoutDiv);
		
		
		// Create an angle unit setting
		var settingAngleUnitDiv = layout.createSettingDiv("Angle Unit");
		
		// The angle unit buttons
		var settingAngleUnitButtons = [];
		settingAngleUnitButtons.push(layout.createButton("Degrees", self.updateAngleUnit, "var(--theme-color-main)"));
		settingAngleUnitButtons.push(layout.createButton("Radians", self.updateAngleUnit, "var(--theme-color-main)"));
		settingAngleUnitButtonDiv = layout.createButtonRow(settingAngleUnitButtons);
		
		// Add the angle unit buttons to the themeAngleUnitDiv
		settingAngleUnitDiv.appendChild(settingAngleUnitButtonDiv);
		// Add the themeAngleUnitDiv to the mainDiv
		mainDiv.appendChild(settingAngleUnitDiv);
	};
	
	return self;
}();