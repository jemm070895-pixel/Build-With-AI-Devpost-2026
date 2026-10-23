@echo off
setlocal
cd /d "%~dp0"
title AZHERYN G3 - Validar y jugar en 3 dispositivos
call "%~dp0COMPROBAR_G3_SIN_ABRIR_JUEGO.bat"
if errorlevel 1 (
 echo.
 echo VALIDACION FALLIDA: no se abrira el juego.
 echo Enviame RESULTADO_COMPROBACION_G3.txt
 pause
 exit /b 1
)
echo.
echo VALIDACION CORRECTA. Iniciando la version compilada para laptop, telefono y tableta...
set "AZHERYN_BUILD_VERIFIED=1"
call "%~dp0JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat"
if errorlevel 1 (
 echo ERROR: el servidor de juego se cerro con fallo.
 pause
 exit /b 1
)
exit /b 0
