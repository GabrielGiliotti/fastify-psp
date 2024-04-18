import { Decimal } from "@prisma/client/runtime/library";

export interface Payable {
    id: number,
	status: string,
    fee: Decimal,
    payment_date: Date
}
