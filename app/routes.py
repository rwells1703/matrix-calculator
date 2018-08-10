from flask import render_template
from app import app

@app.route("/")
def index():
	return render_template("index.html", active="index")

@app.route("/about_matrices")
def about_matrices():
	return render_template("about_matrices.html", active="about_matrices")

@app.route("/matrix_calculator")
def matrix_combo():
	return render_template("matrix_calculator/matrix_calculator.html", active="matrix_calculator")

@app.route("/help")
def help():
        return render_template("help.html", active="help")
