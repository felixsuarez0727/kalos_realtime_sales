FROM node:lts

WORKDIR /app

COPY ./kalos_backend/package*.json /app/backend/

WORKDIR /app/backend

RUN npm install

WORKDIR /app/frontend

COPY ./kalos_frontend/frontend/package*.json /app/frontend/

RUN npm install

WORKDIR /app

COPY ./kalos_backend /app/backend

COPY ./kalos_frontend/frontend /app/frontend


WORKDIR /app/frontend

RUN npm run build # Asegurate que tu package.json del frontend tiene un script 'build'


WORKDIR /app

COPY start-services.sh /app/


RUN chmod +x /app/start-services.sh


EXPOSE 3001
EXPOSE 3000
EXPOSE 8787


CMD ["/app/start-services.sh"]