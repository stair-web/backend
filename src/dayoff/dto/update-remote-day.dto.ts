import { IsNumber, IsString } from "class-validator";

export class UpdateRemoteDay {
    
    staffId?: number;
    
    email?: string;

    @IsNumber()
    amount: number;
    
    @IsNumber()
    month: number;
}