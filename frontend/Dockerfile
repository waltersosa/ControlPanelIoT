# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
