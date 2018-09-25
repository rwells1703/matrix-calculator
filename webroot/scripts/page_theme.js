// Predefined themes for all elements in the app
var themeSalmonPink = {
	"color-main":"#ff4c4c",
	"color-main-dark":"#ed2d2d",
	"color-main-light":"#ff7c7c",
	"color-page-background":"#fcfcfc",
	"color-textbox-border":"#b2b2b2",
	"box-shadow":"0px 2px 5px rgba(0,0,0,0.3)",
	"box-shadow-navbar":"0px 2px 5px rgba(0,0,0,0.2)",
	"box-shadow-navbar-item":"2px 0px 15px rgba(0,0,0,0.5), -2px 0px 15px rgba(0,0,0,0.5)",
	"border-radius":"0.6vh"
};

var themeElectricBlue = {
	"color-main":"#0082d8",
	"color-main-dark":"#0065a8",
	"color-main-light":"#5cabe0",
	"color-page-background":"#fcfcfc",
	"color-textbox-border":"#b2b2b2",
	"box-shadow":"0px 2px 5px rgba(0,0,0,0.3)",
	"box-shadow-navbar":"0px 2px 5px rgba(0,0,0,0.2)",
	"box-shadow-navbar-item":"2px 0px 15px rgba(0,0,0,0.5), -2px 0px 15px rgba(0,0,0,0.5)",
	"border-radius":"0.6vh"
};

var themeMustardYellow = {
	"color-main":"#f9c400",
	"color-main-dark":"#e0af00",
	"color-main-light":"#ffdc5e",
	"color-page-background":"#fcfcfc",
	"color-textbox-border":"#b2b2b2",
	"box-shadow":"0px 2px 5px rgba(0,0,0,0.3)",
	"box-shadow-navbar":"0px 2px 5px rgba(0,0,0,0.2)",
	"box-shadow-navbar-item":"2px 0px 15px rgba(0,0,0,0.5), -2px 0px 15px rgba(0,0,0,0.5)",
	"border-radius":"0.6vh"
};

var themeSlateGrey = {
	"color-main":"#424242",
	"color-main-dark":"#333333",
	"color-main-light":"#898989",
	"color-page-background":"#fcfcfc",
	"color-textbox-border":"#b2b2b2",
	"box-shadow":"0px 2px 5px rgba(0,0,0,0.3)",
	"box-shadow-navbar":"0px 2px 5px rgba(0,0,0,0.2)",
	"box-shadow-navbar-item":"2px 0px 15px rgba(0,0,0,0.5), -2px 0px 15px rgba(0,0,0,0.5)",
	"border-radius":"0.6vh"
};

var theme = themeSalmonPink;

document.body.style.setProperty("--theme-color-main", theme["color-main"]);
document.body.style.setProperty("--theme-color-main-dark", theme["color-main-dark"]);
document.body.style.setProperty("--theme-color-main-light", theme["color-main-light"]);
document.body.style.setProperty("--theme-color-page-background", theme["color-page-background"]);
document.body.style.setProperty("--theme-color-textbox-border", theme["color-textbox-border"]);
document.body.style.setProperty("--theme-box-shadow", theme["box-shadow"]);
document.body.style.setProperty("--theme-box-shadow-navbar", theme["box-shadow-navbar"]);
document.body.style.setProperty("--theme-box-shadow-navbar-item", theme["box-shadow-navbar-item"]);
document.body.style.setProperty("--theme-border-radius", theme["border-radius"]);

// Predefined fonts
var fontMontserrat = "'Montserrat', sans-serif";
var fontRaleway = "'Raleway', sans-serif";

var font = fontRaleway;

document.body.style.fontFamily = font;

// Gets the relative path of the current page being viewed
var url = window.location.pathname.split("/");
var page = url[url.length - 1];

// Hilights the label of the currently opened page in the navbar
var navbarItems = document.getElementById("navbar").children;
if (page == "index.html") {
	navbarItems[0].className = "navbar-item active";
}
else if (page == "about_matrices.html") {
	navbarItems[1].className = "navbar-item active";
}
else if (page == "matrix_calculator.html") {
	navbarItems[2].className = "navbar-item active";
}
else if (page == "help.html") {
	navbarItems[3].className = "navbar-item active";
}
else if (page == "settings.html") {
	navbarItems[4].className = "navbar-item active";
}