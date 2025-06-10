import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject()
  private readonly prisma: PrismaService;

  async getUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    return await this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    id: string;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { id, data } = params;

    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password as string, 10);
      data.password = hashedPassword;
    }

    return await this.prisma.user.update({
      data,
      where: {
        id: Number(id),
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
