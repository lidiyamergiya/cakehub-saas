import { Module } from '@nestjs/common';
import { BakeryController } from './bakery.controller';
import { BakeryService } from './bakery.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BakeryController],
  providers: [BakeryService],
})
export class BakeryModule {}