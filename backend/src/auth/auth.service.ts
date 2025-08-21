import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const result = user.toObject();
      delete result.password;
      return result;
    }
    return null;
  }

  async login(user: { _id: string; email: string; role: string }) {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create({ ...dto, role: 'user' });
    return this.login(user);
  }
}
