#!/bin/sh

echo "Starting entrypoint.sh"

echo "Environment variables:"
echo "$HELLO_MESSAGE"

# Replace placeholders in env.template.js with actual environment variables
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

# Start the web server (e.g., Nginx)
# exec "$@"

echo "Finished entrypoint.sh"

nginx -g 'daemon off;'