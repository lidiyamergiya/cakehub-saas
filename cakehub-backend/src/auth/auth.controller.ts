import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req 
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

import { Role } from '@prisma/client';


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}


  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }



  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }



  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }



  @Get('owner-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BAKERY_OWNER)
  ownerTest() {
    return {
      message: "Welcome Bakery Owner"
    };
  }

}