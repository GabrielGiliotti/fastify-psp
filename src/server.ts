import fastify, { FastifyInstance } from "fastify";
import { TransactionController } from "./Controllers/transaction.controller";
import { HomeController } from "./Controllers/home.controller";

const app: FastifyInstance = fastify({ logger: false });

app.register(HomeController, {
    prefix: '/'
})

app.register(TransactionController, {
    prefix: '/transactions'
})

app.listen({ port: 3100 }, async () => {
    console.log("Server is running on port 3100");
});

export { app };