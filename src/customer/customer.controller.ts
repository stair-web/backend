import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  async getAll(@Query() getAllCustomerDto: GetAllCustomerDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.customerService.getAll(
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

  @Put('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình chỉnh sửa thông tin khách hàng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chỉnh sửa thông tin khách hàng thành công',
  })
  @ApiOperation({ summary: 'Chỉnh sửa khách hàng.' })
  async update(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {      
      return this.customerService.updateCustomer(
        transactionManager,
        updateCustomerDto,
        uuid,
      );
    });
  }


  @Get('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình lấy thông tin khách hàng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin khách hàng thành công',
  })
  @ApiOperation({ summary: 'Lấy thông tin khách hàng' })
  async getDetail(
    @Param('uuid') id: string,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.customerService.getCustomerByUuid(
        transactionManager,
        id,
      );
    });
  }

  
  @Delete('/:uuid')
  @ApiResponse({
    status: 500,
    description: 'Lỗi trong quá trình  xoá khách hàng.',
  })
  @ApiResponse({
    status: 200,
    description: 'Xoá thông tin khách hàng thành công',
  })
  @ApiOperation({ summary: 'Xoá khách hàng thành công.' })
  async delete(
    @Param('uuid') uuid: string,
  ) {
    return await this.connection.transaction((transactionManager) => {      
      return this.customerService.deleteCustomer(
        transactionManager,
        uuid,
      );
    });
  }
}
