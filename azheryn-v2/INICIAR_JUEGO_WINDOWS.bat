@echo off
setlocal
cd /d "%~dp0"
echo AZHERYN V2 - Chapter 1
where node >nul 2>&1
if errorlevel 1 (
 echo ERROR: Node.js is required. Install Node.js LTS from https://nodejs.org/
 pause
 exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
 echo ERROR: npm was not found. Reinstall Node.js LTS.
 pause
 exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
 echo Installing dependencies from package-lock.json...
 call npm ci
 if errorlevel 1 goto fail
)
echo Checking production build...
call npm run build
if errorlevel 1 goto fail
echo.
echo Opening local game at http://localhost:5173/
start "" "http://localhost:5173/"
call npm run dev -- --host 127.0.0.1
if errorlevel 1 goto fail
exit /b 0
:fail
echo.
echo ERROR: Setup or build failed. Read the error above.
pause
exit /b 1
