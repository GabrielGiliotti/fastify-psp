import { TransactionCreateDto } from "../DTOs/transaction.create.dto";
import { TransactionUpdateDto } from "../DTOs/transaction.update.dto";
import { Transaction } from "../Models/transaction";

export interface ITransactionsRepository {
    create(dto: TransactionCreateDto): Promise<Transaction>;
    getById(id: number): Promise<Transaction | null>;
    getAll(): Promise<Transaction[]>;
    update(id: number, dto: TransactionUpdateDto): Promise<Transaction | null>;
    delete(id: number): Promise<string>;
}