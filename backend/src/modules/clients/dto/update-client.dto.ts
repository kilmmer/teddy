// src/clients/dto/update-client.dto.ts
import { PartialType } from '@nestjs/swagger'; // Para herdar propriedades do CreateClientDto
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  // Todas as propriedades de CreateClientDto são opcionais aqui
}
