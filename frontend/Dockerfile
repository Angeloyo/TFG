# Dockerfile para frontend en modo desarrollo

FROM node:22-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Exponer puerto de Next.js
EXPOSE 3000

# Comando para ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]
