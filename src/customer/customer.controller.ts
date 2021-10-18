import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('customer')
export class CustomerController {
    
    @Post('/register')
    register(@Body() bodyDto:any){
        console.log(bodyDto);
        
        return 'abc'
    }


    @Get('/sign-in')
    signIn(
        
        ) {
        return {code : 200, message:'Login successfull.', version : 1.1};
    }
}
