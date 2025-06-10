import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject()
  private readonly prisma: PrismaService;

  async getUser(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
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

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }
}
