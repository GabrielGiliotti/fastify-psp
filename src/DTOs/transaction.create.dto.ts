export interface TransactionCreateDto {
    amount: number,
	description: string,
	method: string,
	name: string,
	cpf: string,
	card_number?: string,
	valid?: string,
	cvv?: string
}