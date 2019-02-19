import http.server
import os

# Change the current working directory to the webroot
# This allows the web pages to be accessed over http
os.chdir("webroot")

# Run the server on localhost, port 8080 (standard http port)
server_address = ("0.0.0.0", 8080)

# Creates the server object on the address
server = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Run the server forever
print("HTTP server running on %s:%s" % (server_address[0], server_address[1]))
try:
    server.serve_forever()
except KeyboardInterrupt:
    # Closes the server socket
    server.socket.close()
    print("HTTP server closed on %s:%s" % (server_address[0], server_address[1]))
