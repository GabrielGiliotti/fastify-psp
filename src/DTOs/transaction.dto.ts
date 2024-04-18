import { Payable } from './../Models/payable';

export interface TransactionDto {
    amount: number,
	description: string,
	method: string,
	name: string,
	card_number?: string | null,
	valid?: string | null,
	payableId?: number,
	payable?: Payable
}
