// mcp/tools.js
export default function registerTools(mcpServer) {
  mcpServer.tool(
    'echo_tool',
    'Echo back the text you send',
    {
      text: 'string',
    },
    async ({ text }) => {
      return { echoed: `You said: ${text}` };
    }
  );
}
