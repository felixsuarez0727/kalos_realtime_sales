# Usa una imagen base con Node.js
FROM node:lts

# Establece el directorio de trabajo principal dentro del contenedor
WORKDIR /app

# --- Backend Steps: Dependency Installation ---
# Copia SOLO los archivos de definicion de dependencias del backend.
COPY ./kalos_backend/package*.json /app/backend/

# Establece el directorio de trabajo temporalmente en el directorio del backend para instalar dependencias
WORKDIR /app/backend

# Instala las dependencias del backend DENTRO del contenedor.
RUN npm install

# --- Frontend Steps: Dependency Installation ---
# Vuelve al directorio de trabajo principal para cambiar al del frontend
WORKDIR /app/frontend

# Copia SOLO los archivos de definicion de dependencias del frontend.
COPY ./kalos_frontend/frontend/package*.json /app/frontend/

# Instala las dependencias del frontend DENTRO del contenedor.
RUN npm install

# --- General Steps: Copy Source Code ---
# Vuelve al directorio de trabajo principal
WORKDIR /app

# Copia el resto del codigo fuente del backend (excluye node_modules por .dockerignore)
COPY ./kalos_backend /app/backend

# Copia el resto del codigo fuente del frontend (excluye node_modules por .dockerignore)
COPY ./kalos_frontend/frontend /app/frontend

# --- Frontend Steps: Build ---
# Cambia al directorio del frontend para ejecutar el comando de build
WORKDIR /app/frontend
# Ejecuta el build de produccion del frontend DENTRO del contenedor
RUN npm run build # Asegurate que tu package.json del frontend tiene un script 'build'

# --- General Steps: Setup & Run ---
# Vuelve al directorio de trabajo principal
WORKDIR /app

# !!! ELIMINAMOS LA INSTALACION DE PM2 !!!
# RUN npm install -g pm2

# !!! ELIMINAMOS LA COPIA DEL ARCHIVO DE CONFIGURACION DE PM2 !!!
# COPY processes.json /app/

# Copia el NUEVO script de inicio shell al contenedor
COPY start-services.sh /app/

# Haz el script de inicio ejecutable
RUN chmod +x /app/start-services.sh

# Expon los puertos
EXPOSE 3001
EXPOSE 3000
EXPOSE 8787

# Comando que se ejecuta al iniciar el contenedor: Ejecuta el script shell.
# El script iniciara ambos servicios y usara 'wait' para mantener el contenedor corriendo.
CMD ["/app/start-services.sh"]