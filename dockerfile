# stage 1: build
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL $VITE_API_URL

ARG VITE_GG_CLIENT_ID
ENV VITE_GG_CLIENT_ID $VITE_GG_CLIENT_ID

ARG VITE_GG_REDIRECT_URI
ENV VITE_GG_REDIRECT_URI $VITE_GG_REDIRECT_URI
RUN npm run build

# stage 2: production environment
FROM nginx:1.21-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
