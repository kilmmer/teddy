// src/clients/dto/create-client.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Para documentação Swagger

export class CreateClientDto {
  @ApiProperty({ description: 'Nome completo do cliente', example: 'Eduardo' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente não pode ser vazio.' })
  name: string;

  @ApiProperty({
    description: 'Salário do cliente, formatado como string',
    example: 'R$ 3.500,00',
  })
  @IsString()
  @IsNotEmpty({ message: 'O salário não pode ser vazio.' })
  // Opcional: Adicionar validação de formato para salário se for mais rigoroso
  salary: string;

  @ApiProperty({
    description: 'Empresa do cliente',
    example: 'Minha Empresa Ltda.',
  })
  @IsString()
  @IsNotEmpty({ message: 'A empresa não pode ser vazia.' })
  company: string;
}
