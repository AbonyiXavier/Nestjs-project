import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/services/auth/auth.service';
import { User } from './users.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async createUser(firstName: string, email: string, password: string) {
    try {
      const emailExist = await this.findByEmail(email);

      if (emailExist) {
        throw new HttpException('Email alread in use', HttpStatus.CONFLICT);
      }

      let pass = await this.authService.hashPassword(password);

      const newUser = new this.userModel({
        firstName,
        email,
        password: pass,
      });
      let jwt_token = await this.authService.generateJwt(newUser);
      const savedUser = await newUser.save();
      return {
        savedUser,
        access_token: jwt_token,
      };
    } catch (error) {
      return error.response;
    }
  }
  async loginUser(email: string, password: string) {
    try {
      const user = await this.findByEmail(email);

      if (!user) {
        throw new NotFoundException('User not registered');
      }

      const passwordMatch = await this.authService.comparePassword(
        user.password,
        password,
      );
      let jwt_token = await this.authService.generateJwt(user);
      if (passwordMatch) {
        return {
          user,
          access_token: jwt_token,
        };
      } else {
        throw new HttpException(
          'Email/password not valid',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      return error.response;
    }
  }

  private async findByEmail(email: string): Promise<User> {
    try {
      const mailCheck = await this.userModel.findOne({ email }).exec();
      return mailCheck;
    } catch (error) {
      return error.response;
    }
  }
}
