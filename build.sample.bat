docker build ^
--build-arg VITE_API_URL=http://localhost:8001 ^
--build-arg VITE_GG_CLIENT_ID=CLIENT_ID.apps.googleusercontent.com ^
--build-arg VITE_GG_REDIRECT_URI=http://localhost:9000 ^
. -t trieuvu/client:deploy