import { app } from '../server';

describe("Transaction Controller Test", () => {
    
    it("should return a TransactionDto[]", async () => {
      
        const result = await app.inject({
            method: 'GET', 
            url: '/transactions'
        })

       expect(result.json()).toEqual({ root: true });
    });
});