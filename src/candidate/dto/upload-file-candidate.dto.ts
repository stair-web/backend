import { ApiConsumes, ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UploadedFileCandidateDto{
    uuid:string;
}
