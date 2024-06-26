import { TransactionDto } from '../DTOs/transaction.dto';
import { TransactionCreateDto } from '../DTOs/transaction.create.dto';
import { TransactionsRepository } from "../Repositories/transactions.repository";
import { TransactionUpdateDto } from '../DTOs/transaction.update.dto';
import { SaldoDto } from '../DTOs/saldo.dto';
import { MessageDto } from '../DTOs/message.dto';

class TransactionsService {
    
    private _transactionRepo: TransactionsRepository;

    constructor() { this._transactionRepo = new TransactionsRepository(); }

    async create(data: TransactionCreateDto): Promise<TransactionDto> 
    {
        const result = await this._transactionRepo.create(data);

        const obj: TransactionDto = 
        {
            amount: result.amount,
            description: result.description,
            method: result.method,
            name: result.name,
            card_number: result.card_number,
            valid: result.valid,
        }

        return obj;
    }

    async getAll(skip: number, take: number): Promise<TransactionDto[]> 
    {
        const transactions = await this._transactionRepo.getAll(skip, take);

        let transactionDtoList: TransactionDto[] = [];

        transactions.forEach(e => {
            
            let transactionDto: TransactionDto = {
                amount: e.amount,
                description: e.description,
                method: e.method,
                name: e.name,
                card_number: e.card_number,
                valid: e.valid,
                payable: e.payable ? e.payable : undefined
            };

            transactionDtoList.push(transactionDto);
        });

        return transactionDtoList;
    }

    async getById(id: number): Promise<TransactionDto | null> 
    {
        const result = await this._transactionRepo.getById(id);

        if(result) 
        {
            const obj: TransactionDto = 
            {
                amount: result.amount,
                description: result.description,
                method: result.method,
                name: result.name,
                card_number: result.card_number,
                valid: result.valid,
                payable: result.payable ? result.payable : undefined
            }
            return obj;
        }
        return null;
    }

    async getSaldoByNameOrCpf(name?: string, cpf?: string): Promise<SaldoDto> 
    {
        return await this._transactionRepo.getSaldoByNameOrCpf(name, cpf);
    }

    async update(id: number, data: TransactionUpdateDto): Promise<TransactionDto | null> 
    {
        const result = await this._transactionRepo.update(id, data);

        if(result) 
        {
            const obj: TransactionDto = 
            {
                amount: result.amount,
                description: result.description,
                method: result.method,
                name: result.name,
                card_number: result.card_number,
                valid: result.valid,
            }
            return obj;
        }
        return null;
    }

    async delete(id: number): Promise<MessageDto> 
    {
        return await this._transactionRepo.delete(id);
    }
}

export { TransactionsService };