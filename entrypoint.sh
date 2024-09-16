#!/bin/sh

echo "Starting entrypoint.sh"

# Export environment variables explicitly
export API_URL=${API_URL}

# Kiểm tra nếu các biến môi trường có giá trị không
if [ -z "$API_URL" ]; then
  echo "No environment variables found, skipping env substitution."
else
  echo "Environment variables found, performing substitution."

  # Replace placeholders in env.template.js with actual environment variables
  envsubst '$API_URL' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

# Start the web server (e.g., Nginx)
# exec "$@"

echo "Finished entrypoint.sh"

nginx -g 'daemon off;'