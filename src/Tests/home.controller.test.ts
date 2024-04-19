import { app } from '../server';

describe("Home Controller Test", () => {
    
    it("should return {root:true}", async () => {
      
        const result = await app.inject({
            method: 'GET', 
            url: '/'
        })

       expect(result.json()).toEqual({ root: true });
    });
});
