import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateJwt(user: User) {
    const token = this.jwtService.sign({ user });
    return token;
  }

  async hashPassword(password: string) {
    const hashPass = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hashPass;
  }

  async comparePassword(hashPassword: string, password: string) {
    const compareHash = bcrypt.compareSync(password, hashPassword);
    return compareHash;
  }
}
