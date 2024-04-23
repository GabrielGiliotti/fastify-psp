import { MessageDto } from "../DTOs/message.dto";
import { PayableDto } from "../DTOs/payable.dto";
import { Payable } from "../Models/payable";

export interface IPayablesRepository {
    create(dto: PayableDto): Promise<Payable>;
    getById(id: number): Promise<Payable | null>;
    update(id: number, method: string): Promise<Payable | null>;
    delete(id: number): Promise<MessageDto>;
}
