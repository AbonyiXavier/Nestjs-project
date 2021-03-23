import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { Response } from 'express';
import { PassThrough } from 'stream';
import { UserService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/register')
  async register(
    @Body('firstName') firstName: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.createUser(
        firstName,
        email,
        password,
      );

      if (data) {
        return res.status(HttpStatus.CREATED).json({
          data,
        });
      }
      if (!data) {
        console.log('data', data);
      }
    } catch (error) {
      return error.message;
    }
  }

  @Post('auth/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.loginUser(email, password);
      if (data) {
        return res.status(HttpStatus.CREATED).json({
          data,

          //   data: {
          //     firstName: data.user.firstName,
          //     email: data.user.email,
          //     access_token: data.access_token,
          //   },
        });
      }
    } catch (error) {
      return error.response;
    }
  }
}
