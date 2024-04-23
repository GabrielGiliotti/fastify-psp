import { Decimal } from "@prisma/client/runtime/library";

export interface PayableDto {
    status: string,
	fee: Decimal | string,
    payment_date: Date | string
}
