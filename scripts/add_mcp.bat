@echo off

echo * claude @ %AppData%\Claude\claude_desktop_config.json
call claude mcp add wassette -- wassette serve --stdio
echo * claude mcp add returned %ERRORLEVEL%
dir %AppData%\Claude\claude_desktop_config.json
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
