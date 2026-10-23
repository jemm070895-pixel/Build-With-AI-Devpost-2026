@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title AZHERYN V2 - Validar y jugar G2
set "LOG=%~dp0VALIDACION_G2_RESULTADOS.txt"
echo AZHERYN V2 - Resultado de validacion > "%LOG%"
echo Fecha: %date% %time% >> "%LOG%"
where node >nul 2>&1
if errorlevel 1 (
 echo ERROR: Node.js no encontrado. >> "%LOG%"
 echo ERROR: Instala Node.js para continuar.
 pause
 exit /b 1
)
node --version >> "%LOG%" 2>&1
npm --version >> "%LOG%" 2>&1
set /a PASSED=0
set /a FAILED=0
echo Ejecutando pruebas...
for %%F in (tests\*.cjs) do (
 echo --- %%~nxF --- >> "%LOG%"
 node --experimental-strip-types "%%F" >> "%LOG%" 2>&1
 if errorlevel 1 (
  echo FALLO: %%~nxF
  set /a FAILED+=1
 ) else (
  set /a PASSED+=1
 )
)
echo Pruebas correctas: !PASSED! Fallidas: !FAILED!
echo Pruebas correctas: !PASSED! Fallidas: !FAILED! >> "%LOG%"
if not "!FAILED!"=="0" goto error
if not exist "node_modules\.bin\vite.cmd" (
 echo Instalando dependencias...
 call npm ci --no-audit --no-fund >> "%LOG%" 2>&1
 if errorlevel 1 goto error
)
echo Compilando TypeScript y Vite...
call npm run build >> "%LOG%" 2>&1
if errorlevel 1 goto error
echo COMPILACION CORRECTA >> "%LOG%"
echo.
echo Compilacion correcta. Se abrira el juego en http://127.0.0.1:4173
start "" cmd /c "timeout /t 3 /nobreak >nul & start "" "http://127.0.0.1:4173""
call npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
if errorlevel 1 goto error
exit /b 0
:error
echo.
echo ERROR DE VALIDACION. Abre VALIDACION_G2_RESULTADOS.txt
 echo ERROR: Revisa el registro y envia el archivo para diagnostico. >> "%LOG%"
pause
exit /b 1
