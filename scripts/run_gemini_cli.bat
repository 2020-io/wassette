@echo off
setlocal EnableExtensions
setlocal EnableDelayedExpansion

rem set GOOGLE_CLOUD_PROJECT=
rem set GEMINI_API_KEY=
rem set GOOGLE_GENAI_USE_VERTEXAI=
echo GOOGLE_CLOUD_PROJECT=%GOOGLE_CLOUD_PROJECT%
echo GEMINI_API_KEY=%GEMINI_API_KEY%
echo GOOGLE_GENAI_USE_VERTEXAI=%GOOGLE_GENAI_USE_VERTEXAI%

set ARGS=-m gemini-2.5-flash
echo * gemini %ARGS% %*
call gemini %ARGS% %*
set err=%ERRORLEVEL%
echo * gemini returned %ERRORLEVEL%

echo Exit code: %err%
exit /b %err%
