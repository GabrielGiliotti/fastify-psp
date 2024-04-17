import { transactionSchema } from './../schemas/transaction.schema';
import { FastifyInstance } from 'fastify';
import { TransactionsService } from '../services/transaction.service';
import { TransactionCreateDto } from '../DTOs/transaction.create.dto';
import { TransactionUpdateDto } from '../DTOs/transaction.update.dto';
import { ajv } from '../configs/ajv.config';

export async function TransactionController(fastify: FastifyInstance) {

    const _transactionService = new TransactionsService();

    fastify.post<{ Body: TransactionCreateDto }>('/', 
    { 
        schema: transactionSchema,
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

    fastify.get('/', async (_, reply) => {
        try 
        {
            const data = await _transactionService.getAll();
            return reply.status(200).send(data);
        } 
        catch (error) 
        {
            return reply.send(error);
        }
    });

    fastify.put<{ Body: TransactionUpdateDto ; Params: { id: string }}>('/:id', async (req, reply) => {
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