import flask
from app import app
	
@app.route("/")
def index():
	return flask.render_template("index.html", active="index")

@app.route("/about_matrices")
def about_matrices():
	return flask.render_template("about_matrices.html", active="about_matrices")

@app.route("/matrix_calculator")
def matrix_calculator():
	return flask.render_template("matrix_calculator/matrix_calculator.html", active="matrix_calculator")

@app.route("/help")
def help():
	return flask.render_template("help.html", active="help")

# This makes sure that JS files are not cached in the browser cache
# This is useful because it means that I do not have to clear browser cache every time I make a change to a JS script during development
# This section will be removed in production
@app.after_request
def after_request(response):
	file_extension = flask.request.__dict__["environ"]["PATH_INFO"].split(".")[-1]
	if file_extension == "js":
		response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
		response.headers["Pragma"] = "no-cache"
		response.headers["Expires"] = "0"
	return response
