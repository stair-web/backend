import { ApiProperty } from "@nestjs/swagger";

export class CreateTeamDto {

    uuid?:string;

    createdAt?:Date;

    updateAt?:Date;

    isDeleted:boolean;

    @ApiProperty()
    name?: string;
    
    @ApiProperty(
        {default:null}
    )
    leaderId?: number;
    

}