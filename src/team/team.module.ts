import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamRepository]),
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
