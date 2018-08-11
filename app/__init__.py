import os
import flask

# Changes the default behaviour of flask so that the template folder and static folder are all pointed towards a single "webroot" directory
webroot = os.path.dirname(os.path.abspath(__file__))+"\\webroot"
	
app = flask.Flask(__name__, template_folder = webroot, static_folder = webroot, static_url_path = "")

from app import routes
