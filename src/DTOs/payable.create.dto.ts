import { Decimal } from "@prisma/client/runtime/library";

export interface PayableCreateDto {
    status: string,
	fee: Decimal,
    payment_date: Date
}
