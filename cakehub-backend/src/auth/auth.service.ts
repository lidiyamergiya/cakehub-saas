import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {

    // Step 1: Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Step 3: Save the user to the database
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Step 4: Return safe user data (without the password)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}