import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBakeryDto } from './dto/create-bakery.dto';

@Injectable()
export class BakeryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createBakeryDto: CreateBakeryDto,
    ownerId: number,
  ) {
    try {
      return await this.prisma.bakery.create({
        data: {
          ...createBakeryDto,
          ownerId,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'You already own a bakery',
        );
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.bakery.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}