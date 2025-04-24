#!/bin/bash


set -e

echo "Starting backend..."

cd /app/backend
npx tsx server.ts &

BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"


echo "Starting frontend..."

cd /app/frontend
npx next start -p 3000 &

FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"


cd /app

echo "All services started. Monitoring..."


wait $BACKEND_PID $FRONTEND_PID

echo "One or more services stopped. Container exiting."

exit $?