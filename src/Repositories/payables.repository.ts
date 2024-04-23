import { PayableDto } from "../DTOs/payable.dto";
import { Payable } from "../Models/payable";
import { prisma } from "../Database/prisma-client";
import { IPayablesRepository } from "../Interfaces/ipayables.repository";
import PayableExtension from "../Extensions/payable.extension";
import { MessageDto } from "../DTOs/message.dto";

class PayablesRepository implements IPayablesRepository
{
    async create(dto: PayableDto): Promise<Payable> 
    {
        return await prisma.payable.create({
            data: {
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

        const payable = PayableExtension.DefinePayable(method);
        
        return await prisma.payable.update({
            where: {
                id
            },
            data: {
                status: payable.status,
                fee: payable.fee,
                payment_date: payable.payment_date
            }
        })
    }

    async delete(id: number): Promise<MessageDto> {

        await prisma.payable.delete({
            where: {
                id
            }
        }).catch(() => {
            throw new Error(`Payable ${id} already deleted.`)
        });
        
        return { message: `Payable ${id} deleted succesfully.` };
    }
}

export { PayablesRepository };
