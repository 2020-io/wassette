#!/usr/bin/env python3.13
from fastmcp import FastMCP
import httpx

# Create server
mcp = FastMCP("WASM Agent Server")


@mcp.tool
def wasmagent_tool(text: str) -> str:
    """Echo the input text"""
    return text


@mcp.resource("wasmagent://static")
def wasmagent_resource() -> str:
    return "WasmAgent v1.0"


@mcp.resource("wasmagent://{text}")
def wasmagent_template(text: str) -> str:
    """Echo the input text"""
    return f"WasmAgent Template: {text}"


@mcp.prompt("wasmagent")
def wasmagent_prompt(text: str) -> str:
    return text
