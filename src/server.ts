import { TransactionController } from "./Controllers/transaction.controller";
import { HomeController } from "./Controllers/home.controller";
import app from "./index"
    
const server = app();

server.register(HomeController, {
    prefix: '/'
})

server.register(TransactionController, {
    prefix: '/transactions'
})

server.listen({ port: 3100 }, async () => {
    console.log("Server is running on port 3100");
});