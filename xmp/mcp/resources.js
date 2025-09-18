// mcp/resources.js
export default function registerResources(mcpServer) {
  mcpServer.resource(
    'hello_resource',
    'A simple resource that returns a greeting',
    {
      name: 'string',
    },
    async ({ name }) => {
      return { message: `Hello, ${name} from MCP resource!` };
    }
  );
}
