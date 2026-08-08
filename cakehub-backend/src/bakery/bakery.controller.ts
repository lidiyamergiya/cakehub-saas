import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BakeryService } from './bakery.service';
import { CreateBakeryDto } from './dto/create-bakery.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { Role } from '@prisma/client';

@Controller('bakery')
export class BakeryController {
  constructor(private readonly bakeryService: BakeryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BAKERY_OWNER)
  async create(
    @Body() createBakeryDto: CreateBakeryDto,
    @Req() req: any,
  ) {
    const ownerId = req.user.userId;

    return this.bakeryService.create(
      createBakeryDto,
      ownerId,
    );
  }

  @Get()
  async findAll() {
    return this.bakeryService.findAll();
  }
}