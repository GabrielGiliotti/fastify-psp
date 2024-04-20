import { createTransactionSchema } from '../Schemas/create.transaction.schema';
import { FastifyInstance } from 'fastify';
import { TransactionsService } from '../Services/transaction.service';
import { TransactionCreateDto } from '../DTOs/transaction.create.dto';
import { TransactionUpdateDto } from '../DTOs/transaction.update.dto';
import { IPagination } from '../Interfaces/ipagination.query';
import { ajv } from '../Configs/ajv.config';
import { ISaldoQuery } from '../Interfaces/isaldo.query';
import { updateTransactionSchema } from '../Schemas/update.transaction.schema';

export async function TransactionController(fastify: FastifyInstance) {

    const _transactionService = new TransactionsService();

    fastify.post<{ Body: TransactionCreateDto }>('/', 
    { 
        schema: createTransactionSchema,
        validatorCompiler: ({ schema }) => ajv.compile(schema), schemaErrorFormatter: (errors) => new Error(errors[0].message)
    } , 
    async (req, reply) => {
        try 
        {
            const data = await _transactionService.create(req.body);
            return reply.status(201).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });

    fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
        try 
        {
            const {id} = req.params;
            const data = await _transactionService.getById(parseInt(id));
            return reply.status(200).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });

    fastify.get<{ Querystring: IPagination }>('/', async (req, reply) => {
        try 
        {
            let {skip, take} = req.query;

            if(!skip)
                skip = "0";

            if(!take)
                take = "5";

            const data = await _transactionService.getAll(parseInt(skip), parseInt(take));
            return reply.status(200).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });

    fastify.get<{ Querystring: ISaldoQuery }>('/saldo', async (req, reply) => {
        try 
        {
            let {name, cpf} = req.query;
            const data = await _transactionService.getSaldoByNameOrCpf(name, cpf);
            return reply.status(200).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });

    fastify.put<{ Body: TransactionUpdateDto ; Params: { id: string }}>('/:id', 
    {
        schema: updateTransactionSchema,
        validatorCompiler: ({ schema }) => ajv.compile(schema), schemaErrorFormatter: (errors) => new Error(errors[0].message)
    },
    async (req, reply) => {
        try 
        {
            const {id} = req.params;
            const body = req.body;
            const data = await _transactionService.update(parseInt(id), body);
            return reply.status(200).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });

    fastify.delete<{Params: { id: string }}>('/:id', async (req, reply) => {
        try 
        {
            const {id} = req.params;
            const data = await _transactionService.delete(parseInt(id));
            return reply.status(200).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });
}
