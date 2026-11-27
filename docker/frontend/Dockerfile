# ETAPA 1: Construir el frontend con Node
FROM node:24-alpine AS build

WORKDIR /app

COPY front-projecteTR1-G4/package*.json ./

RUN npm ci

COPY front-projecteTR1-G4/ ./

RUN npm run build


# ETAPA 2: Servir el frontend con Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY docker/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]