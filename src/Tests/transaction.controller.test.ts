import { Decimal } from '@prisma/client/runtime/library';
import { TransactionDto } from './../DTOs/transaction.dto';
import { ajv } from '../Configs/ajv.config';
import { TransactionCreateDto } from '../DTOs/transaction.create.dto';
import { createTransactionSchema } from '../Schemas/create.transaction.schema';
import app  from '../index'
import PayableExtension from '../Extensions/payable.extension';
import { IPagination } from '../Interfaces/ipagination.query';

describe('Transaction controller Tests', () => {
    
    // Configuration
    let address;
    const build = app();

    beforeAll(async () => {
        await build.listen();
        address = build.server.address();
    });

    afterAll(async () => {
        await build.close();
    });

    // Mock da requisicao POST
    build.post("/transactions",
        {
            schema: createTransactionSchema,
            validatorCompiler: ({ schema }) => ajv.compile(schema), schemaErrorFormatter: (errors) => new Error(errors[0].message)
        },
        async (req, reply) => reply.status(201).send(req.body)
    );

    // Editable Req Body
    let reqBody: TransactionCreateDto = {
        amount: 500,
        description: "Airpods 5x",
        name: "Gabriel Giliotti",
        method: "pix",
        cpf: "43863534883",
        card_number: null,
        valid: null,
        cvv: null
    }

    test("Success PIX POST status 201", async () => {

        const res = await build.inject({
            method: 'POST',
            url: "/transactions",
            body: reqBody
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(201);
        expect(obj).toStrictEqual(reqBody);
    });
    
    test("Success Credit Card POST status 201", async () => {

        reqBody.card_number = "7001700270037004";
        reqBody.valid = "1227";
        reqBody.cvv = "753";
        
        const res = await build.inject({
            method: 'POST',
            url: "/transactions",
            body: reqBody
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(201);
        expect(obj).toStrictEqual(reqBody);
    });

    let generalErrorSchemaValidationResponse = {
        code: "FST_ERR_VALIDATION",
        error: "Bad Request",
        message: "must match \"then\" schema",
        statusCode: 400,
    }

    test("Error cpf POST status 400", async () => {
        
        // Error body
        reqBody.cpf = "4386353483"

        // Error response 1
        generalErrorSchemaValidationResponse.message = "cpf must not contain dots or dashes. Ex: 12345678900";

        const res = await build.inject({
            method: 'POST',
            url: "/transactions",
            body: reqBody
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(400);
        expect(obj).toStrictEqual(generalErrorSchemaValidationResponse);
    });

    test("Error card_number POST status 400", async () => {
        
        // Error body
        reqBody.cpf = "43863534883";
        reqBody.card_number =  "7001-7002-7003-5004";

        generalErrorSchemaValidationResponse.message = "card_number must be a string. Format Ex: 7001700270037004";

        const res = await build.inject({
            method: 'POST',
            url: "/transactions",
            body: reqBody
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(400);
        expect(obj).toStrictEqual(generalErrorSchemaValidationResponse);
    });

    test("Error valid POST status 400", async () => {
        
        // Error body
        reqBody.card_number =  "7001700270035004";
        reqBody.valid = "1327";

        generalErrorSchemaValidationResponse.message = "valid must be a string and have the format MMYY";

        const res = await build.inject({
            method: 'POST',
            url: "/transactions",
            body: reqBody
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(400);
        expect(obj).toStrictEqual(generalErrorSchemaValidationResponse);
    });

    test("Error cvv POST status 400", async () => {
        
        // Error body
        reqBody.valid = "1227";
        reqBody.cvv = "75";

        generalErrorSchemaValidationResponse.message = "cvv must be a string and have 3 digits";

        const res = await build.inject({
            method: 'POST',
            url: "/transactions",
            body: reqBody
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(400);
        expect(obj).toStrictEqual(generalErrorSchemaValidationResponse);
    });


    // Mock da requisicao GET
    let transactionList: TransactionDto[] = [
        {
            amount: 500,
            description: "Airpods",
            method: "pix",
            name: "Gabriel Giliotti",
            card_number: null,
            valid: null,
            payable: PayableExtension.DefinePayable("pix")
        },
        {
            amount: 150,
            description: "Airpods",
            method: "credit_card",
            name: "Gabriel Giliotti",
            card_number: "7004700570067007",
            valid: "1227",
            payable: PayableExtension.DefinePayable("credit_card")
        },
    ];

    build.get("/transactions", async (_, reply) => {
        reply.status(200).send(transactionList);
    });

    it("GET status 200", async () => {
        
        const res = await build.inject({
            method: 'GET',
            url: "/transactions",
        });

        const obj = JSON.parse(res.body);

        expect(res.statusCode).toStrictEqual(200);
        expect(obj).toStrictEqual(transactionList);
    });

});

