import app  from '../index'

describe('Home controller inject Test', () => {
    
    let address;
    const build = app();

    // Mock de uma requisicao Get
    build.get("/", async () => {});

    // Mock de uma requisicao Post com Body
    build.post("/transactions",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                    required: ["name"],
                },
                response: {
                    201: {
                        description: "Success Response",
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        async (_, reply) => reply.status(201).send({ message: "created" })
    );

    beforeEach(async () => {
        await build.listen();
        address = build.server.address();
    });

    afterEach(async () => {
        await build.close();
    });

    it("GET status 200", async () => {
        
        const res = await build.inject({
            method: 'GET',
            url: "/",
        });

        expect(res.statusCode.toString()).toMatch('200');
    });
    
});

