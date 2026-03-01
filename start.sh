#!/bin/bash
echo "Starting LemonadeFlow Setup & Launch..."

# 1. Check if Lemonade server is running
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/models)
if [ "$HTTP_STATUS" -ne 200 ]; then
  echo "[WARNING]: AMD Lemonade Server not detected at http://localhost:8000/api/v1"
  echo "If USE_MOCK_LEMONADE=false, the AI nodes will fail."
else
   echo"[OK]: AMD Lemonade Server detected!"
fi

#2. Run the root concurrently script
echo "Launching FastAPI Orchestrator and Electron Frontend..."
npm run start