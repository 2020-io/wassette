#!/usr/bin/env python3.13
from fastmcp import FastMCP
import httpx

# Create server
mcp = FastMCP("WASM Agent Server")

# TODO: what are all the @mcp.* annocations?

@mcp.tool
def wasmagent_tool(text: str) -> str:
    """Echo the input text"""
    return text

#########################################
# Static resources
#########################################

@mcp.resource("wasmagent://static")
def wasmagent_resource() -> str:
    return "WasmAgent v1.0"


@mcp.prompt("wasmagent")
def wasmagent_prompt(text: str) -> str:
    return text

# Static resource
@mcp.resource("config://version")
def get_version():
    return "1.0.0"

#########################################
# Dynamic resources
#########################################

@mcp.resource("wasmagent://{text}")
def wasmagent_template(text: str) -> str:
    """Echo the input text"""
    return f"WasmAgent Template: {text}"


@mcp.resource("users://{user_id}/profile")
def get_profile(user_id: int):
    return {"name": f"User {user_id}", "status": "active"}

if __name__ == "__main__":
    import asyncio
    asyncio.run(mcp.run_async())
