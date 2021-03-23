import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/services/auth/auth.module';
import { AuthService } from 'src/services/auth/auth.service';
import { UserController } from './users.controller';
import { UserSchemaModel } from './users.model';
import { UserService } from './users.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchemaModel }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
