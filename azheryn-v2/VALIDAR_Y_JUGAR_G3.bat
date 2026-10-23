@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title AZHERYN V2 G3 - Validacion completa
set "LOG=%~dp0VALIDACION_G3_RESULTADOS.txt"
>"%LOG%" echo AZHERYN V2 G3 - Validacion completa
>>"%LOG%" echo Fecha: %date% %time%
where node >nul 2>&1
if errorlevel 1 (
 echo ERROR: Falta Node.js
 >>"%LOG%" echo ERROR: Node.js no encontrado
 goto fail
)
where npm >nul 2>&1
if errorlevel 1 (
 echo ERROR: Falta npm
 >>"%LOG%" echo ERROR: npm no encontrado
 goto fail
)
node --version >>"%LOG%" 2>&1
call npm --version >>"%LOG%" 2>&1
set /a PASSED=0
set /a FAILED=0
for %%F in (tests\*.cjs) do (
 echo Comprobando %%~nxF
 >>"%LOG%" echo --- %%~nxF ---
 node --experimental-strip-types "%%F" >>"%LOG%" 2>&1
 if errorlevel 1 (set /a FAILED+=1) else (set /a PASSED+=1)
)
echo Pruebas correctas: !PASSED! / Fallidas: !FAILED!
>>"%LOG%" echo Pruebas correctas: !PASSED! / Fallidas: !FAILED!
if not "!FAILED!"=="0" goto fail
if not exist "node_modules\.bin\vite.cmd" (
 echo Instalando dependencias necesarias...
 call npm ci --no-audit --no-fund >>"%LOG%" 2>&1
 if errorlevel 1 goto fail
)
echo Compilando G3...
call npm run build >>"%LOG%" 2>&1
if errorlevel 1 goto fail
>>"%LOG%" echo COMPILACION G3 CORRECTA
if not exist "dist\index.html" goto fail
echo COMPILACION CORRECTA. Abriendo el juego...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://127.0.0.1:4173"
call npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
if errorlevel 1 goto fail
exit /b 0
:fail
echo.
echo ERROR: Enviame VALIDACION_G3_RESULTADOS.txt
>>"%LOG%" echo VALIDACION INCOMPLETA - REVISA ERRORES ANTERIORES
pause
exit /b 1
