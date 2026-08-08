import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBakeryDto } from './dto/create-bakery.dto';
import { UpdateBakeryDto } from './dto/update-bakery.dto';

@Injectable()
export class BakeryService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new bakery
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

  // Get all bakeries
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

  // Get one bakery by ID
  async findOne(id: number) {
    const bakery = await this.prisma.bakery.findUnique({
      where: {
        id,
      },
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

    if (!bakery) {
      throw new NotFoundException('Bakery not found');
    }

    return bakery;
  }

  // Update a bakery
  async update(
    id: number,
    updateBakeryDto: UpdateBakeryDto,
    ownerId: number,
  ) {
    const bakery = await this.prisma.bakery.findUnique({
      where: {
        id,
      },
    });

    if (!bakery) {
      throw new NotFoundException('Bakery not found');
    }

    if (bakery.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You can only update your own bakery',
      );
    }

    return this.prisma.bakery.update({
      where: {
        id,
      },
      data: updateBakeryDto,
    });
  }

  // Delete a bakery
  async remove(
    id: number,
    ownerId: number,
  ) {
    const bakery = await this.prisma.bakery.findUnique({
      where: {
        id,
      },
    });

    if (!bakery) {
      throw new NotFoundException('Bakery not found');
    }

    if (bakery.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You can only delete your own bakery',
      );
    }

    return this.prisma.bakery.delete({
      where: {
        id,
      },
    });
  }
}