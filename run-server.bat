@echo off
REM Magic Markup - Local Development Server (Windows)
REM This script starts a local HTTP server to run the examples

echo.
echo 🪄 Magic Markup - Starting Local Server...
echo.
echo Server will start on: http://localhost:8765
echo.
echo Available examples:
echo   • Basic Example:    http://localhost:8765/examples/basic-example.html
echo   • Advanced Example: http://localhost:8765/examples/advanced-example.html
echo   • Module Example:   http://localhost:8765/examples/module-example.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python -m http.server 8765
) else (
    where python3 >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        python3 -m http.server 8765
    ) else (
        echo Error: Python is not installed or not in PATH
        echo Please install Python to run the development server
        pause
        exit /b 1
    )
)
