// Declare namespace
settings = {};

// Gets the label of the button that was pressed as text. Necessary because the buttons have padding and clicking inside the padding vs clicking outside, causes different click events to be registered.
settings.getButtonValue = function(clickEvent) {
	// If the user clicks directly on the button label, take the value from there
	if (event["path"][0].style.display == "table-cell") {
		return event["path"][0].innerHTML;
	}
	// Otherwise, the user clicked on the button padding, so we must take the value from its child, the label
	return event["path"][0].children[0].innerHTML;
};

// Updates the color aspect of theme
settings.updateColor = function(event) {
	var value = settings.getButtonValue(event)
	theme.setColor(value);
};

// Updates the shade aspect of theme
settings.updateShade = function(event) {
	var value = settings.getButtonValue(event)
	theme.setShade(value);
};

// Updates the style aspect of theme
settings.updateStyle = function(event) {
	var value = settings.getButtonValue(event)
	theme.setStyle(value);
};

// Creates 3 seperate, labelled rows of buttons for each theme setting
settings.createThemeButtons = function (event) {
    // The color label above the buttons
    var colorLabel = document.createElement("div");
    colorLabel.innerHTML = "Color<br><br><br>";
    mainDiv.appendChild(colorLabel);

    // The first row of color buttons
    var themeColorButtonsTop = [];
    themeColorButtonsTop.push(layout.createButton("Ruby Red", settings.updateColor, theme.colors["Ruby Red"]["color-main"]));
    themeColorButtonsTop.push(layout.createButton("Sapphire Blue", settings.updateColor, theme.colors["Sapphire Blue"]["color-main"]));
    themeColorButtonsTop.push(layout.createButton("Amber Yellow", settings.updateColor, theme.colors["Amber Yellow"]["color-main"]));
    themeColorButtonTopDiv = layout.createButtonRow("themeColorButtonTopDiv", themeColorButtonsTop);

    // The second row of color buttons
    var themeColorButtonsBottom = [];
    themeColorButtonsBottom.push(layout.createButton("Slate Grey", settings.updateColor, theme.colors["Slate Grey"]["color-main"]));
    themeColorButtonsBottom.push(layout.createButton("Amethyst Purple", settings.updateColor, theme.colors["Amethyst Purple"]["color-main"]));
    themeColorButtonsBottom.push(layout.createButton("Emerald Green", settings.updateColor, theme.colors["Emerald Green"]["color-main"]));
    themeColorButtonBottomDiv = layout.createButtonRow("themeColorButtosBottomDiv", themeColorButtonsBottom);

    // Add the color buttons to the mainDiv
    mainDiv.appendChild(themeColorButtonTopDiv);
    mainDiv.appendChild(themeColorButtonBottomDiv);


    // The shade label above the buttons
    var shadeLabel = document.createElement("div");
    shadeLabel.innerHTML = "Shade<br><br><br>";
    mainDiv.appendChild(shadeLabel);

    // The shade buttons
    var themeShadeButtons = [];
    themeShadeButtons.push(layout.createButton("Light", settings.updateShade, "var(--theme-color-main)"));
    themeShadeButtons.push(layout.createButton("Dark", settings.updateShade, "var(--theme-color-main)"));
    themeShadeButtonDiv = layout.createButtonRow("themeShadeButtonDiv", themeShadeButtons);

    // Add the shade buttons to the mainDiv
    mainDiv.appendChild(themeShadeButtonDiv);


    // The style label above the buttons
    var styleLabel = document.createElement("div");
    styleLabel.innerHTML = "Style<br><br><br>";
    mainDiv.appendChild(styleLabel);

    // The style buttons
    var themeStyleButtons = [];
    themeStyleButtons.push(layout.createButton("Material", settings.updateStyle, "var(--theme-color-main)"));
    themeStyleButtons.push(layout.createButton("Flat", settings.updateStyle, "var(--theme-color-main)"));
    themeShadeButtonDiv = layout.createButtonRow("themeShadeButtonDiv", themeStyleButtons);

    // Add the style buttons to the mainDiv
    mainDiv.appendChild(themeShadeButtonDiv);
};