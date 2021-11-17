import { ApiConsumes, ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { TypeUploadFileCandidate } from "../enum/type-upload-file-candidate.enum";

export class UploadedFileCandidateDto{
    // @ApiProperty({
    //     required: true,
    //     description: 'Type of file upload',
    //     enum: TypeUploadFileCandidate,
    // })
    // @IsEnum(TypeUploadFileCandidate)
    // type:TypeUploadFileCandidate;

    // @ApiProperty({ format:'binary'  ,   type: 'docs/doc/pdf', })
    // file: any;

    uuid:string;
}
