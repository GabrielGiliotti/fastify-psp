import { FastifyInstance } from 'fastify';

export async function HomeController(fastify: FastifyInstance) {

    fastify.get('/', async (_, reply) => {
        try 
        {
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);
            return reply.code(200).send({ home: `API started at ${today.toLocaleString()}` });
        }
        catch (error) 
        {
            return reply.code(500).send("Internal server error");
        }
    })
}
