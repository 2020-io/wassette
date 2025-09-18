// routes/example.js
export default async function (fastify, opts) {
  // GET /api/hello
  fastify.get('/hello', async (request, reply) => {
    return { message: 'Hello from Fastify!' };
  });

  // POST /api/echo
  fastify.post('/echo', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            echoed: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { name } = request.body;
    return { echoed: `You sent: ${name}` };
  });
}
