import os
# Imports Jinja2 from the packages folder (and by extension markupsafe from the same directory)
import packages.jinja2 as jinja2


# Recursively scans through directories in the specified path
# It returns the relative paths of all the files it locates as a list
def scan_directory(scan_dir="."):
    dir_entries = []
    
    for entry in os.scandir(scan_dir):
        entry_path = scan_dir + os.path.sep + entry.name
        
        # A directory, recursively scan it
        if entry.is_dir():
            dir_entries.extend(scan_directory(entry_path))
        # A file, append it
        else:
            dir_entries.append(entry_path)
            
    return dir_entries


# Renders the passed in Jinja2 template
def render_template(template):
    template = env.get_template(template)
    return template.render()


# Loads the specified template from the template directory and returns it's data
# This is custom loader for the Jinja2 template environment
def template_loader(template_name):
    f = open(template_name, "r")
    data = f.read()
    f.close()

    return data


# Create a new Jinja2 template environment used for loading and rendering the templates
env = jinja2.Environment(loader=jinja2.FunctionLoader(template_loader))

# Specifies the directory where the templates are located
template_dir = "templates"
# Specifies the directory where the rendered templates should be output to
rendered_dir = "webroot"


# Loop forever rendering templates when the user presses enter, until shell receives KeyboardInterrupt
while True:
    print("STARTED RENDERING TEMPLATES")
    
    for template_path in scan_directory(template_dir):
        if template_path.split(".")[-1] == "html":
            rendered_path = rendered_dir + os.path.sep + os.path.sep.join(template_path.split(os.path.sep)[1:])
            f = open(rendered_path, "w")
            f.write(render_template(template_path))
            f.close()
            print("Rendered: " + template_path)
            
    print("FINISHED RENDERING TEMPLATES")
    input("Press enter to re-render...")
