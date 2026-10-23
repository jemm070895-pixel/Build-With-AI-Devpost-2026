@echo off
setlocal
cd /d "%~dp0"
title AZHERYN G3 - Informe de pruebas
set "REPORT=INFORME_PRUEBA_REAL_G3.txt"
(
 echo AZHERYN V2 - G3 - INFORME DE PRUEBA REAL
 echo Fecha: %date% %time%
 echo Equipo Windows: %COMPUTERNAME%
 echo.
 echo Compilacion Windows: PENDIENTE
 echo Laptop: PENDIENTE
 echo Telefono: PENDIENTE
 echo Tableta: PENDIENTE
 echo Almacen 91/91: PENDIENTE
 echo.
 echo Anota los resultados debajo de cada linea. No cambies PENDIENTE por OK sin probarlo.
 echo Consulta PRUEBA_FINAL_G3_TRES_DISPOSITIVOS.md para el recorrido.
) > "%REPORT%"
start "" notepad "%REPORT%"
echo Informe creado: %REPORT%
pause
