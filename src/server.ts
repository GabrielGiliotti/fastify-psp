import fastify, { FastifyInstance } from "fastify";
import { TransactionController } from "./controllers/transaction.controller";
import { HomeController } from "./controllers/home.controller";

const app: FastifyInstance = fastify({ logger: true });

app.register(HomeController, {
    prefix: '/'
})

app.register(TransactionController, {
    prefix: '/transactions'
})

app.listen({ port: 3100 }, () => {
    console.log("Server is running on port 3100");
});
