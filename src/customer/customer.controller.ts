import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetAllCustomerDto } from './dto/get-all-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private connection: Connection,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách khách hàng thành công.',
  })
  @ApiOperation({ summary: 'Danh sách khách hàng' })
  async getAllUser(@Query() getAllCustomerDto: GetAllCustomerDto) {
    console.log(getAllCustomerDto);

    return await this.connection.transaction((transactionManager) => {
      return this.customerService.getAllUser(
        transactionManager,
        getAllCustomerDto,
      );
    });
  }

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Lỗi hệ thống trong quá trình tạo khách hàng.',
  })
  @ApiResponse({
    status: 409,
    description: 'Khách hàng đã tồn tại trong hệ thống',
  })
  @ApiOperation({ summary: 'Tạo khách hàng.' })
  @ApiResponse({ status: 201, description: 'Tạo khách hàng thành công' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.customerService.createCustomer(
        transactionManager,
        createCustomerDto,
      );
    });
  }

  @Put('/:id')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình chỉnh sửa thông tin khách hàng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chỉnh sửa thông tin khách hàng',
  })
  @ApiOperation({ summary: 'Chỉnh sửa khách hàng.' })
  async update(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Param('id') id: string,
  ) {
    console.log(id);

    return await this.connection.transaction((transactionManager) => {
      return this.customerService.updateCustomer(
        transactionManager,
        updateCustomerDto,
        id,
      );
    });
  }
}
