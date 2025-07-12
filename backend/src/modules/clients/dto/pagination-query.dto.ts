// src/clients/dto/pagination-query.dto.ts
import { IsOptional, IsNumberString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Número da página a ser retornada (padrão: 1)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumberString() // Valida se é uma string de número
  page?: string;

  @ApiProperty({
    description: 'Número de itens por página (padrão: 10)',
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsNumberString() // Valida se é uma string de número
  limit?: string;

  @ApiProperty({
    description: 'Termo de busca para nome ou e-mail do cliente',
    required: false,
    example: 'Eduardo',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
