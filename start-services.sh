#!/bin/bash

# Detener la ejecucion si algun comando falla
set -e

echo "Starting backend..."
# Navega al directorio del backend y ejecuta el comando en segundo plano (&)
cd /app/backend
npx tsx server.ts &
# Guarda el PID del proceso del backend
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"


echo "Starting frontend..."
# Navega al directorio del frontend y ejecuta el comando en segundo plano (&)
# Next.js por defecto usa el puerto 3000 en produccion, pero lo especificamos por claridad
cd /app/frontend
npx next start -p 3000 &
# Guarda el PID del proceso del frontend
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

# Vuelve a un directorio neutro (opcional)
cd /app

echo "All services started. Monitoring..."

# Espera a que ambos procesos en segundo plano terminen
# Si uno de los procesos hijos con los PIDs $BACKEND_PID o $FRONTEND_PID termina,
# el comando 'wait' tambien terminara, y el script continuara (o saldra si set -e esta activo y la espera falla)
# Una caida de uno de los servicios detendra el contenedor.
wait $BACKEND_PID $FRONTEND_PID

echo "One or more services stopped. Container exiting."

# Sal con el codigo de salida del ultimo comando esperado que fallo o 0 si todos terminaron normalmente
exit $?