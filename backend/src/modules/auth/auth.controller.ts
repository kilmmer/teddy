import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/users.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido, retorna token de acesso.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(
    @Body() login: Partial<LoginDto>,
  ): Promise<{ user: User; accessToken: string }> {
    if (!login.name) {
      throw new Error('Name is required for login');
    }
    return this.authService.login(login.name);
  }
}
