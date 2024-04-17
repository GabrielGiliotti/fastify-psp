import { Decimal } from "@prisma/client/runtime/library";
import { PayableCreateDto } from "../DTOs/payable.create.dto";
import { Payable } from "../Models/payable";
import { prisma } from "../database/prisma-client";
import { IPayablesRepository } from "./ipayables.repository";

class PayablesRepository implements IPayablesRepository
{
    async create(dto: PayableCreateDto): Promise<Payable> 
    {
        return await prisma.payable.create({
            data : {
                status: dto.status,
                fee: dto.fee,
                payment_date: dto.payment_date
            }
        });
    }    

    async getById(id: number): Promise<Payable | null> 
    {    
        return await prisma.payable.findFirst({
            where: {
                id
            }
        }) || null;
    }

    async update(id: number, method: string): Promise<Payable | null> {

        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        
        return await prisma.payable.update({
            where: {
                id
            },
            data: {
                status: method === "pix" ? "paid" : "waiting_funds",
                fee: method === "pix" ? new Decimal((2.99/100)) : new Decimal((8.99/100)),
                payment_date: method === "pix" ? today : new Date(today.setDate(today.getDate() + 15))
            }
        })
    }

    async delete(id: number): Promise<string> {

        await prisma.payable.delete({
            where: {
                id
            }
        }).catch(() => {
            throw new Error(`Payable ${id} already deleted.`)
        });
        
        return `Payable ${id} deleted succesfully.`;
    }
}

export { PayablesRepository };