# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Construir la aplicación
RUN npm run build

# Etapa de producción: servir con Nginx
FROM nginx:alpine

# Copiar artefactos estáticos
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
