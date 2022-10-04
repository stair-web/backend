import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    CustomerRepository
  ]),
  EmailModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
