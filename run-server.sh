#!/bin/bash

# Magic Markup - Local Development Server
# This script starts a local HTTP server to run the examples

echo "🪄 Magic Markup - Starting Local Server..."
echo ""
echo "Server will start on: http://localhost:8765"
echo ""
echo "Available examples:"
echo "  • Basic Example:    http://localhost:8765/examples/basic-example.html"
echo "  • Advanced Example: http://localhost:8765/examples/advanced-example.html"
echo "  • Module Example:   http://localhost:8765/examples/module-example.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8765
elif command -v python &> /dev/null; then
    python -m http.server 8765
else
    echo "Error: Python is not installed or not in PATH"
    echo "Please install Python to run the development server"
    exit 1
fi
