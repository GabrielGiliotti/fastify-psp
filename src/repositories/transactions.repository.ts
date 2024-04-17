import { PayableCreateDto } from './../DTOs/payable.create.dto';
import { TransactionCreateDto } from "../DTOs/transaction.create.dto";
import { TransactionUpdateDto } from "../DTOs/transaction.update.dto";
import { Transaction } from "../Models/transaction";
import { prisma } from "../database/prisma-client";
import { ITransactionsRepository } from "./itransactions.repository";
import { PayablesRepository } from "./payables.repository";
import { Decimal } from '@prisma/client/runtime/library';

class TransactionsRepository implements ITransactionsRepository
{
    private _payableRepo: PayablesRepository;

    constructor() { this._payableRepo = new PayablesRepository(); }

    async getAll(): Promise<Transaction[]> 
    {
        return await prisma.transaction.findMany();
    }
    
    async getById(id: number): Promise<Transaction | null> 
    {    
        const transaction = await prisma.transaction.findFirst({
            where: {
                id
            }
        }) || null;

        const payable = await prisma.payable.findFirst({
            where: {
                id: transaction?.payableId
            }
        }) || null;

        
        if(!transaction || !payable)
            throw new Error("Treta"); 
            
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
            payableId: payable.id,
            payable: payable,
        }

        return result;
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

        await prisma.transaction.delete({
            where: {
                id: transaction?.id
            }
        }).catch(() => {
            throw new Error(`Transaction ${id} already deleted.`)
        });

        await prisma.payable.delete({
            where: {
                id: transaction?.payableId
            }
        }).catch(() => {
            throw new Error(`Payable ${transaction?.payableId} already deleted.`)
        });
        
        return `Transaction ${id} deleted succesfully.`;
    }
}

export { TransactionsRepository };