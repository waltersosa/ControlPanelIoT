FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Asegura que el servidor escuche en el puerto esperado
ENV PORT=5174
EXPOSE 5174

CMD ["npm", "start"]