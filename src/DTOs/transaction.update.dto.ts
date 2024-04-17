export interface TransactionUpdateDto {
	method: string,
	name: string,
	cpf: string,
	card_number?: string,
	valid?: string,
	cvv?: string
}