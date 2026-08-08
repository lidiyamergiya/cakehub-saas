import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BakeryService } from './bakery.service';
import { CreateBakeryDto } from './dto/create-bakery.dto';
import { UpdateBakeryDto } from './dto/update-bakery.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { Role } from '@prisma/client';

@Controller('bakery')
export class BakeryController {
  constructor(
    private readonly bakeryService: BakeryService,
  ) {}

  // POST /bakery
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

  // GET /bakery
  @Get()
  async findAll() {
    return this.bakeryService.findAll();
  }

  // GET /bakery/:id
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.bakeryService.findOne(
      Number(id),
    );
  }

  // PATCH /bakery/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BAKERY_OWNER)
  async update(
    @Param('id') id: string,
    @Body() updateBakeryDto: UpdateBakeryDto,
    @Req() req: any,
  ) {
    const ownerId = req.user.userId;

    return this.bakeryService.update(
      Number(id),
      updateBakeryDto,
      ownerId,
    );
  }

  // DELETE /bakery/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BAKERY_OWNER)
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const ownerId = req.user.userId;

    return this.bakeryService.remove(
      Number(id),
      ownerId,
    );
  }
}