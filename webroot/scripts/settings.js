// Declare namespace
settings = function ()
{
	var self = {};
	
	// Gets the label of the button that was pressed as text
	self.getButtonValue = function (clickEvent)
	{
		return clickEvent["path"][0].innerHTML;
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
		themeColorButtonsTop.push(layout.createButton("Ruby Red", self.updateColor, theme.colors["Ruby Red"]["color-main"], theme.colors["Ruby Red"]["color-main-light"], theme.colors["Ruby Red"]["color-text-foreground"]));
		themeColorButtonsTop.push(layout.createButton("Sapphire Blue", self.updateColor, theme.colors["Sapphire Blue"]["color-main"], theme.colors["Sapphire Blue"]["color-main-light"], theme.colors["Sapphire Blue"]["color-text-foreground"]));
		themeColorButtonsTop.push(layout.createButton("Amber Yellow", self.updateColor, theme.colors["Amber Yellow"]["color-main"], theme.colors["Amber Yellow"]["color-main-light"], theme.colors["Amber Yellow"]["color-text-foreground"]));
		themeColorButtonTopDiv = layout.createButtonRow(themeColorButtonsTop);

		// The second row of color buttons
		var themeColorButtonsBottom = [];
		themeColorButtonsBottom.push(layout.createButton("Slate Grey", self.updateColor, theme.colors["Slate Grey"]["color-main"], theme.colors["Slate Grey"]["color-main-light"], theme.colors["Slate Grey"]["color-text-foreground"]));
		themeColorButtonsBottom.push(layout.createButton("Amethyst Purple", self.updateColor, theme.colors["Amethyst Purple"]["color-main"], theme.colors["Amethyst Purple"]["color-main-light"], theme.colors["Amethyst Purple"]["color-text-foreground"]));
		themeColorButtonsBottom.push(layout.createButton("Emerald Green", self.updateColor, theme.colors["Emerald Green"]["color-main"], theme.colors["Emerald Green"]["color-main-light"], theme.colors["Emerald Green"]["color-text-foreground"]));
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
		themeShadeButtons.push(layout.createButton("Light", self.updateShade));
		themeShadeButtons.push(layout.createButton("Dark", self.updateShade));
		themeShadeButtonDiv = layout.createButtonRow(themeShadeButtons);

		// Add the shade buttons to the themeShadeDiv
		themeShadeDiv.appendChild(themeShadeButtonDiv);
		// Add the themeShadeDiv to the mainDiv
		mainDiv.appendChild(themeShadeDiv);

		
		// Create a style setting
		var themeStyleDiv = layout.createSettingDiv("Style");

		// The style buttons
		var themeStyleButtons = [];
		themeStyleButtons.push(layout.createButton("Material", self.updateStyle));
		themeStyleButtons.push(layout.createButton("Flat", self.updateStyle));
		themeStyleButtonDiv = layout.createButtonRow(themeStyleButtons);

		// Add the style buttons to the themeStyleDiv
		themeStyleDiv.appendChild(themeStyleButtonDiv);
		// Add the themeStyleDiv to the mainDiv
		mainDiv.appendChild(themeStyleDiv);
		
		
		// Create a calculator layout setting
		var themeCalculatorLayoutDiv = layout.createSettingDiv("Calculator Layout");

		// The calculator layout buttons
		var themeCalculatorLayoutButtons = [];
		themeCalculatorLayoutButtons.push(layout.createButton("Equation before solution", self.updateCalculatorLayout));
		themeCalculatorLayoutButtons.push(layout.createButton("Solution before equation", self.updateCalculatorLayout));
		themeCalculatorLayoutButtonDiv = layout.createButtonRow(themeCalculatorLayoutButtons);

		// Add the calculator layout buttons to the themeCalculatorLayoutDiv
		themeCalculatorLayoutDiv.appendChild(themeCalculatorLayoutButtonDiv);
		// Add the themeCalculatorLayoutDiv to the mainDiv
		mainDiv.appendChild(themeCalculatorLayoutDiv);
		
		
		// Create an angle unit setting
		var settingAngleUnitDiv = layout.createSettingDiv("Angle Unit");
		
		// The angle unit buttons
		var settingAngleUnitButtons = [];
		settingAngleUnitButtons.push(layout.createButton("Degrees", self.updateAngleUnit));
		settingAngleUnitButtons.push(layout.createButton("Radians", self.updateAngleUnit));
		settingAngleUnitButtonDiv = layout.createButtonRow(settingAngleUnitButtons);
		
		// Add the angle unit buttons to the themeAngleUnitDiv
		settingAngleUnitDiv.appendChild(settingAngleUnitButtonDiv);
		// Add the themeAngleUnitDiv to the mainDiv
		mainDiv.appendChild(settingAngleUnitDiv);
		

		// Create a unit test button
		var unitTestDiv = layout.createSettingDiv("Perform Unit Testing");

		// The unit test buttons
		unitTestButtons = [];
		unitTestButtons.push(layout.createButton("Overall summary", unit_tests.test.bind(null, false, false, false)));
		unitTestButtons.push(layout.createButton("Individual summaries", unit_tests.test.bind(null, true, false, false)));
		unitTestButtons.push(layout.createButton("Full test", unit_tests.test.bind(null, true, true, false)));
		unitTestButtonDiv = layout.createButtonRow(unitTestButtons);
		
		// Add the unit test buttons to the unitTestDiv
		unitTestDiv.appendChild(unitTestButtonDiv);
		// Add the unitTestDiv to the mainDiv
		mainDiv.appendChild(unitTestDiv);
	};
	
	return self;
}();