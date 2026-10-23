@echo off
setlocal
cd /d "%~dp0"
title AZHERYN V2 - Laptop, tableta y telefono (Wi-Fi local)
where node >nul 2>&1 || (echo ERROR: instala Node.js LTS. & pause & exit /b 1)
where npm >nul 2>&1 || (echo ERROR: npm no encontrado. & pause & exit /b 1)
if not exist "node_modules\.bin\vite.cmd" goto install_deps
if not exist "node_modules\react\jsx-runtime.js" goto install_deps
if not exist "node_modules\typescript\bin\tsc" goto install_deps
if not exist "node_modules\@types\react\index.d.ts" goto install_deps
if not exist "node_modules\@types\react-dom\index.d.ts" goto install_deps
if not exist "node_modules\vite\bin\vite.js" goto install_deps
goto ready_to_play
:install_deps
echo Preparando el juego por primera vez. Necesitas Internet para instalar dependencias.
call npm ci --no-audit --no-fund --fetch-retries=1 --fetch-timeout=20000
if errorlevel 1 goto installation_failed
goto ready_to_play
:installation_failed
echo ERROR: No se pudieron instalar las dependencias.
echo Ejecuta COMPROBAR_G3_SIN_ABRIR_JUEGO.bat y envia el informe.
pause
exit /b 1
:ready_to_play
echo Comprobando que el juego compile antes de abrirlo...
if /i "%AZHERYN_BUILD_VERIFIED%"=="1" if exist "dist\index.html" goto compiled_ok
call npm run build
if errorlevel 1 (
 echo ERROR: el juego no compila. Ejecuta COMPROBAR_G3_SIN_ABRIR_JUEGO.bat
 pause
 exit /b 1
)
:compiled_ok
if not exist "dist\index.html" (
 echo ERROR: falta dist\index.html despues de compilar.
 pause
 exit /b 1
)
echo Compilacion correcta. Se servira la version compilada, no el servidor de desarrollo.
echo.
echo AZHERYN V2 - JUEGO COMPARTIDO POR WI-FI LOCAL
 echo 1. Laptop: abre http://localhost:5173
 echo 2. Telefono o tableta: conecta al MISMO Wi-Fi que la laptop.
 echo 3. Direcciones locales detectadas para abrir en telefono o tableta:
 powershell -NoProfile -Command "$ips=Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notmatch '^(127\.|169\.)' -and $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual|VPN' }; $ips | ForEach-Object { Write-Host ('    http://' + $_.IPAddress + ':5173') }; if (-not $ips) { Write-Host '    No se detecto una IP local; consulta la linea Network debajo.' }"
 echo Si hay varias direcciones, usa la de tu red Wi-Fi.
 echo 4. Si Windows pregunta, permite acceso SOLO en redes privadas de confianza.
 echo 5. Manten esta ventana abierta mientras juegas en otro dispositivo.
 echo SEGURIDAD: utiliza SOLO una red Wi-Fi privada y de confianza.
 echo IMPORTANTE: las partidas se guardan por navegador/dispositivo, NO se sincronizan.
 echo Exporta e importa la partida para trasladarla entre equipos.
 echo.
echo Abriendo el juego en el navegador de la laptop en unos segundos...
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:5173"
call npm run preview -- --host 0.0.0.0 --port 5173 --strictPort
if errorlevel 1 (echo No se pudo iniciar el servidor local. & pause & exit /b 1)
