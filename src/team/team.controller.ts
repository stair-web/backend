import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Post')
@Controller('post')
export class TeamController {
  constructor() {}
}