@echo off
setlocal EnableExtensions EnableDelayedExpansion

set SCRIPT_DIR=%~dp0
rem echo SCRIPT_DIR=%SCRIPT_DIR%
set PYTHON_FILE=%SCRIPT_DIR%cors_http_server.py
echo PYTHON_FILE=%PYTHON_FILE%

set ASSETS=%~1
if "%~1" == "" (
   echo Using default assets directory "%SCRIPT_DIR%..\assets"
   set ASSETS=%SCRIPT_DIR%..\assets
)

if exist "%ASSETS%" ( 
  echo Serving assets in "%ASSETS%"
) else (
  echo Assets directory "%ASSETS%" does not exist
  echo Serving assets in current directory
  set ASSETS=.
)

pushd "%ASSETS%"
set ASSETS=%CD%
popd

rem set ARGS=8080
set ARGS=-d "%ASSETS%"
set ARGS=%ARGS% --protocol=HTTP/1.0
set ARGS=%ARGS% --bind=127.0.0.1
set ARGS=%ARGS% 8080
set PYTHON_FILE=-m http.server
echo -^> python %PYTHON_FILE% %ARGS%
call python %PYTHON_FILE% %ARGS%
set ret=%ERRORLEVEL%
echo ^<- python returned %ret%
echo.

exit /b %ret%
