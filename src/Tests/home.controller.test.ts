import { app } from '../server';

describe("Home Controller Test", () => {
    
    afterEach(() => { 
        app.close(); 
    });

    it("should return an object informing the current DateTime", async () => {
      
        const result = await app.inject({
            method: 'GET', 
            url: '/'
        });
    
       expect(result.body.toString()).toContain('{"home":"API started at');
    });
});
