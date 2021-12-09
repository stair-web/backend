import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TokenEmailRepository } from 'src/token-email/token-email.repository';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, TokenEmailRepository]),
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: {
        expiresIn: '90d',
      },
    }),
    UserRoleModule
  ],
  controllers: [UserController],
  providers: [UserService,
   ],
   exports:[UserService,
  ]
})
export class UserModule {}
