from app import app

app.debug = True

# Below works with local browser and serveo
#app.run(host = "localhost", port = 80)

# Below works with local browser and local network
app.run(host = "0.0.0.0", port = 80)
