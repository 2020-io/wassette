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

set ARGS=8080
rem set ARGS=-d "%ASSETS%"
rem set ARGS=%ARGS% --protocol=HTTP/1.0
rem set ARGS=%ARGS% --bind=127.0.0.1
rem set ARGS=%ARGS% 8080
rem echo -^> python -m http.server %ARGS%
rem call python -m http.server %ARGS%

echo -^> python "%PYTHON_FILE%" %ARGS%
pushd "%ASSETS%"
set ASSETS=%CD%
echo Running "%PYTHON_FILE%" from "%ASSETS%"
call python %PYTHON_FILE% %ARGS%
set ret=%ERRORLEVEL%
popd
echo ^<- python returned %ret%
echo.

exit /b %ret%
