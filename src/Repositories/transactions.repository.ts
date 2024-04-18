import { PayableCreateDto } from '../DTOs/payable.create.dto';
import { TransactionCreateDto } from "../DTOs/transaction.create.dto";
import { TransactionUpdateDto } from "../DTOs/transaction.update.dto";
import { Transaction } from "../Models/transaction";
import { prisma } from "../Database/prisma-client";
import { ITransactionsRepository } from "../Interfaces/itransactions.repository";
import { Decimal } from '@prisma/client/runtime/library';
import { Payable } from '@prisma/client';
import { PayablesRepository } from './payables.repository';
import { SaldoDto } from '../DTOs/saldo.dto';

class TransactionsRepository implements ITransactionsRepository
{
    private _payableRepo: PayablesRepository;

    constructor() { this._payableRepo = new PayablesRepository(); }

    async getAll(skip: number, take: number): Promise<Transaction[]> 
    {
        let list: Transaction[] = [];

        const transactions = await prisma.transaction.findMany({
            skip: skip,
            take: take
        });

        for(const t of transactions) 
        {
            const payable = await this._payableRepo.getById(t.payableId);

            const transaction: Transaction = 
            {
                amount: t.amount,
                description: t.description,
                method: t.method,
                name: t.name,
                cpf: t.cpf,
                card_number: t.card_number,
                valid: t.valid,
                cvv: t.cvv,
                payableId: t.payableId,
	            payable: payable as Payable,
            }

            list.push(transaction);
        }

        return list;
    }
    
    async getById(id: number): Promise<Transaction | null> 
    {    
        const transaction = await prisma.transaction.findFirst({
            where: {
                id
            }
        }) || null;

        if(transaction) 
        {
            const payable = await this._payableRepo.getById(transaction?.payableId as number);

            const result: Transaction = 
            {
                amount: transaction.amount,
                description: transaction.description,
                method: transaction.method,
                name: transaction.name,
                cpf: transaction.cpf,
                card_number: transaction.card_number,
                valid:transaction.valid,
                cvv: transaction.cvv,
                payableId: payable?.id as number,
                payable: payable as Payable,
            }

            return result;
        }

        throw new Error("Treta");  
    }

    async getSaldoByNameOrCpf(name?: string, cpf?: string): Promise<SaldoDto> 
    {
        
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [{ name }, { cpf }],
            }
        });
                
        const available = transactions.filter(({method}) => method === 'pix').reduce((sum, record) => sum + record.amount, 0);
        const waiting_funds = transactions.filter(({method}) => method === 'credit_card').reduce((sum, record) => sum + record.amount, 0);

        return { available: available, waiting_funds: waiting_funds };
    }
    
    async create(dto: TransactionCreateDto): Promise<Transaction> 
    {
        let cardNumber = dto.card_number?.substring(10,16);
        cardNumber = cardNumber?.replace(cardNumber.substring(0,2), "**");
        
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        let payableDto: PayableCreateDto = 
        {
            status: dto.method === "pix" ? "paid" : "waiting_funds",
            fee: dto.method === "pix" ? new Decimal((2.99/100)) : new Decimal((8.99/100)),
            payment_date: dto.method === "pix" ? today : new Date(today.setDate(today.getDate() + 15))
        }
                
        const payable = await this._payableRepo.create(payableDto);

        const taxedAmount = Math.ceil(dto.amount * (1 - parseFloat(payable.fee.toString())));

        const transaction = await prisma.transaction.create({
            include: { payable: true },
            data : {
                amount: taxedAmount,
                description: dto.description,
                method: dto.method,
                name: dto.name,
                cpf: dto.cpf,
                card_number: cardNumber,
                valid: dto.valid,
                cvv: dto.cvv,
                payableId: payable.id,
            }
        });

        transaction.payable = payable;

        return transaction;
    }

    async update(id: number, dto: TransactionUpdateDto): Promise<Transaction | null> {

        let cardNumber = dto.card_number?.substring(10,16);
        cardNumber = cardNumber?.replace(cardNumber.substring(0,2), "**");
        
        const transaction = await prisma.transaction.update({
            where: {
                id
            },
            include: { payable: true },
            data: {
                method: dto.method,
	            name: dto.name,
	            cpf: dto.cpf,
	            card_number: cardNumber,
	            valid: dto.valid,
	            cvv: dto.cvv 
            }
        });

        const payable = await this._payableRepo.update(transaction.payableId, transaction.method);

        if(payable)
            transaction.payable = payable;

        return transaction;
    }

    async delete(id: number): Promise<string> {

        const transaction = await prisma.transaction.findFirst({
            where: {
                id
            }
        }) || null;

        if(transaction) 
        {
            await prisma.transaction.delete({
                where: {
                    id: transaction?.id
                }
            }).catch(() => {
                throw new Error(`Transaction ${id} already deleted.`)
            });
    
            await this._payableRepo.delete(transaction.payableId);

            return `Transaction ${id} deleted succesfully.`;
        }

        throw new Error(`Error on deleting transaction`);
    }
}

export { TransactionsRepository };
