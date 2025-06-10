import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userData: Prisma.UserCreateInput): Promise<User> {
    return await this.userService.createUser(userData);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async show(@Param('id') id: string): Promise<User | null> {
    return await this.userService.getUser(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.userService.updateUser({
      id,
      data: userData,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<[]> {
    await this.userService.deleteUser(id);

    return [];
  }
}
