@echo off
echo ============================================
echo   LemonadeFlow - AMD Slingshot Hackathon
echo ============================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [INFO] Creating .env from .env.example ...
    copy .env.example .env
    echo [OK] .env created. Edit it if needed.
    echo.
)

REM Check if node_modules exist at root
if not exist "node_modules" (
    echo [SETUP] Installing root dependencies...
    call npm install
    echo.
)

REM Check if frontend node_modules exist
if not exist "frontend\node_modules" (
    echo [SETUP] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

REM Check if backend venv exists
if not exist ".venv" (
    echo [SETUP] Creating Python virtual environment...
    python -m venv .venv
    echo [SETUP] Installing backend dependencies...
    call .venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
    echo.
) else (
    call .venv\Scripts\activate.bat
)

echo.
echo [LAUNCH] Starting LemonadeFlow (Backend + Frontend) ...
echo         Backend:  http://127.0.0.1:8001
echo         Frontend: Electron Desktop App
echo.
echo Press Ctrl+C to stop.
echo.

npm run start
