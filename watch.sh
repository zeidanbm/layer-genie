echo "Loading plugin..."
uxp plugin load

echo "Watching plugin..."
nodemon --exec "uxp plugin reload" -e ts,tsx,css,html
