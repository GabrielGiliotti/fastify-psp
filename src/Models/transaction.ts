import { Payable } from "@prisma/client";

export interface Transaction {
    amount: number,
	description: string,
	method: string,
	name: string,
	cpf: string,
	card_number?: string | null,
	valid?: string | null,
	cvv?: string | null,
	payableId: number,
	payable?: Payable | null,
}

