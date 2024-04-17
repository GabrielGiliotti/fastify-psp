
import { PayableCreateDto } from "../DTOs/payable.create.dto";
import { Payable } from "../Models/payable";

export interface IPayablesRepository {
    create(dto: PayableCreateDto): Promise<Payable>;
    getById(id: number): Promise<Payable | null>;
    update(id: number, method: string): Promise<Payable | null>;
}