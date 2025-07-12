import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Injete o UsersService
    private jwtService: JwtService, // Injete o JwtService se necessário
  ) {}

  async validateUser(name: string): Promise<User> {
    const user = await this.usersService.findOneByName(name);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // Você pode adicionar um método de "login" aqui que chame validateUser
  async login(name: string): Promise<{ user: User; accessToken: string }> {
    const user = await this.validateUser(name);
    // Aqui você geraria seu JWT. Para o teste, pode ser um token mock.
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    // Simulação de geração de token, substitua por lógica real de JWT

    const accessToken = this.jwtService.sign(
      { userId: user.id },
      { secret: 't3ddy_t3st@2025' },
    );
    // const accessToken = 't3ddy_t3st@2025'; // Substitua por um JWT real

    return { user, accessToken };
  }
}
