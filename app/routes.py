from flask import render_template
from app import app

@app.route("/")
def index():
	return render_template("index.html", active="index")

@app.route("/about_matrices")
def about_matrices():
	return render_template("about_matrices.html", active="about_matrices")

@app.route("/matrix_tools")
def matrix_tools():
        return render_template("matrix_tools.html", active="matrix_tools")

@app.route("/matrix_visualiser")
def matrix_visualiser():
	return render_template("matrix_visualiser.html", active="matrix_visualiser")

@app.route("/matrix_combo")
def matrix_combo():
	return render_template("matrix_combo.html", active="matrix_combo")

@app.route("/help")
def help():
        return render_template("help.html", active="help")
