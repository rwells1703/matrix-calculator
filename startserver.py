import sys
sys.path.append('packages/')
from app import app

app.debug = False

# Below works with local browser and local network
app.run(host = "0.0.0.0", port = 80)
