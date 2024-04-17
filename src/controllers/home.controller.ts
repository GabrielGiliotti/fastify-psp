import { FastifyInstance } from 'fastify';

export async function HomeController(fastify: FastifyInstance) {

    fastify.get('/', async () => {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        return { home: `API started at ${today.toLocaleString()}` }
    })
}