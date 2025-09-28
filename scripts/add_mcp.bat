@echo off
setlocal EnableExtensions EnableDelayedExpansion

set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..
rem echo SCRIPT_DIR=%SCRIPT_DIR%
rem echo PROJECT_ROOT=%PROJECT_ROOT%

pushd "%PROJECT_ROOT%"
set PROJECT_ROOT=%CD%
popd

set ARGS=--python=3.13
set REQUIREMENTS=%PROJECT_ROOT%\pyproject.toml
set SERVER_SPEC=%PROJECT_ROOT%\assets\fastmcp\wasmagents.fastmcp.json

if not exist "%REQUIREMENTS%" (
	echo Missing requirements file "%REQUIREMENTS%"
	exit /b 1
)
if not exist "%SERVER_SPEC%" (
	echo Missing server spec file "%SERVER_SPEC%"
	exit /b 1
)

set ARGS=%ARGS% --with-requirements="%REQUIREMENTS%" --server-spec="%SERVER_SPEC%"
echo * fastmcp install mcp-json %ARGS%
fastmcp install mcp-json %ARGS%
echo * fastmcp install mcp-json returned %ERRORLEVEL%

rem TODO: remove
exit /b %ERRORLEVEL%

echo * claude @ %USERPROFILE%\Claude\claude_desktop_config.json
call claude mcp add wassette -- wassette serve --stdio
echo * claude mcp add returned %ERRORLEVEL%
dir %AppData%\Claude\claude_desktop_config.json
dir %AppData%\Claude\config.json
dir %USERPROFILE%\.claude.json
echo.

echo * cursor @ %AppData%\Cursor\mcp.json
call cursor --add-mcp "{\"name\":\"Wassette\",\"command\":\"wassette\",\"args\":[\"serve\",\"--stdio\"]}"
echo * cursor --add-mcp returned %ERRORLEVEL%
dir %AppData%\Cursor\mcp.json
echo.

echo * code @ %AppData%\Code\User\mcp.json
call code --add-mcp "{\"name\":\"Wassette\",\"command\":\"wassette\",\"args\":[\"serve\",\"--stdio\"]}"
echo * code --add-mcp returned %ERRORLEVEL%
dir %AppData%\Code\User\mcp.json
echo.
