import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

    // Step 3: Save the user
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Step 4: Return safe user data
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(data: {
    email: string;
    password: string;
  }) {
    // Step 1: Find the user
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // Step 2: Reject if user doesn't exist
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Step 3: Compare passwords
    const passwordMatch = await bcrypt.compare(
      data.password,
      user.password,
    );

    // Step 4: Reject incorrect password
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Step 5: Create JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Step 6: Return token + safe user information
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}