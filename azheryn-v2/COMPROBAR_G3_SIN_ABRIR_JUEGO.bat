@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "LOG=%~dp0RESULTADO_COMPROBACION_G3.txt"
>"%LOG%" echo AZHERYN V2 G3 - Diagnostico Windows
>>"%LOG%" echo Fecha: %date% %time%
where node >nul 2>&1
if errorlevel 1 (
 >>"%LOG%" echo ERROR: Node.js no encontrado. Instalar Node.js LTS.
 goto fail
)
where npm >nul 2>&1
if errorlevel 1 (
 >>"%LOG%" echo ERROR: npm no encontrado.
 goto fail
)
node --version >>"%LOG%" 2>&1
call npm --version >>"%LOG%" 2>&1
set /a PASSED=0
set /a FAILED=0
for %%F in (tests\*.cjs) do (
 node --experimental-strip-types "%%F" >>"%LOG%" 2>&1
 if errorlevel 1 (
  >>"%LOG%" echo FALLO: %%~nxF
  set /a FAILED+=1
 ) else (set /a PASSED+=1)
)
>>"%LOG%" echo Pruebas: !PASSED! correctas; !FAILED! fallidas.
if not "!FAILED!"=="0" goto fail
if not exist "node_modules\.bin\vite.cmd" goto install_deps
if not exist "node_modules\react\jsx-runtime.js" goto install_deps
if not exist "node_modules\typescript\bin\tsc" goto install_deps
if not exist "node_modules\@types\react\index.d.ts" goto install_deps
if not exist "node_modules\@types\react-dom\index.d.ts" goto install_deps
if not exist "node_modules\vite\bin\vite.js" goto install_deps
goto compile_g3
:install_deps
>>"%LOG%" echo Dependencias ausentes o incompletas; intentando instalacion limpia.
>>"%LOG%" echo Instalando dependencias con npm ci...
call npm ci --no-audit --no-fund --fetch-retries=1 --fetch-timeout=20000 >>"%LOG%" 2>&1
if errorlevel 1 (
 >>"%LOG%" echo ERROR: npm ci fallo. Comprueba conexion a Internet, permisos y espacio disponible.
 goto fail
)
:compile_g3
>>"%LOG%" echo Compilando TypeScript y Vite...
>>"%LOG%" echo IMPORTANTE: la compilacion verifica codigo; no sustituye pruebas reales en dispositivos.
call npm run build >>"%LOG%" 2>&1
if errorlevel 1 goto fail
if not exist "dist\index.html" (
 >>"%LOG%" echo ERROR: No se genero dist\index.html
 goto fail
)
>>"%LOG%" echo RESULTADO: PRUEBAS Y COMPILACION CORRECTAS
>>"%LOG%" echo PENDIENTE: comprobar laptop, telefono, tableta y partida completa 91/91.
cls
echo AZHERYN G3: PRUEBAS Y COMPILACION CORRECTAS
echo Archivo de resultados: RESULTADO_COMPROBACION_G3.txt
pause
exit /b 0
:fail
>>"%LOG%" echo RESULTADO: VALIDACION INCOMPLETA
cls
echo AZHERYN G3: VALIDACION INCOMPLETA
echo Enviame el archivo RESULTADO_COMPROBACION_G3.txt
echo No se han modificado tus partidas.
pause
exit /b 1
