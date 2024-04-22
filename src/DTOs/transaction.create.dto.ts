export interface TransactionCreateDto {
    amount: number,
	description: string,
	method: string,
	name: string,
	cpf: string,
	card_number?: string | null,
	valid?: string | null,
	cvv?: string | null
}
