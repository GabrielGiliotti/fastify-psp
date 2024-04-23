import { Decimal } from "@prisma/client/runtime/library";
import { PayableDto } from "../DTOs/payable.dto";

class PayableExtension 
{
    static DefinePayable(method: string) : PayableDto {
        
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        if(method === "pix") 
        {
            return { status: "paid", fee: new Decimal((2.99/100)).toString(), payment_date: today.toString() };
        }
        else 
        {
            return { status: "waiting_funds", fee: new Decimal((8.99/100)).toString(), payment_date: new Date(today.setDate(today.getDate() + 15)).toString()};
        }
    }

    static GetTaxedAmount(amount: number, fee: Decimal) {
        return Math.ceil(amount * (1 - parseFloat(fee.toString())));
    }

    static OverrideCardNumber(cardNumber: string) {
        let card = cardNumber?.substring(10,16);
        return card = card?.replace(card.substring(0,2), "**");
    }
}

export default PayableExtension;