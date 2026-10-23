@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo ERROR: Node.js no esta instalado.
 pause
 exit /b 1
)
set /a PASSED=0
set /a FAILED=0
for %%F in (tests\*.cjs) do (
 node --experimental-strip-types "%%F" >nul 2>&1
 if errorlevel 1 (
  echo ERROR: %%~nxF
  set /a FAILED+=1
 ) else (
  echo OK: %%~nxF
  set /a PASSED+=1
 )
)
echo.
echo PRUEBAS SUPERADAS: %PASSED%  FALLIDAS: %FAILED%
pause
if not "%FAILED%"=="0" exit /b 1
