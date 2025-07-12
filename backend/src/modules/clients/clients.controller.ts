// src/clients/clients.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Logger, // Para observabilidade
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Descomente quando implementar JWT

@ApiTags('Clients')
@Controller('clients')
// @UseGuards(JwtAuthGuard) // Proteja todos os endpoints de cliente com autenticação
@ApiBearerAuth() // Indica para o Swagger que este controlador usa autenticação JWT
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name); // Inicializa o logger

  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({
    status: 409,
    description: 'Cliente com este e-mail já existe.',
  })
  async create(@Body() createClientDto: CreateClientDto) {
    // this.logger.log(`Creating client: ${createClientDto.email}`); // Exemplo de observabilidade
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna a lista de clientes com paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso.',
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    this.logger.log(
      `Fetching clients with query: ${JSON.stringify(paginationQuery)}`,
    );
    const { clients, total } =
      await this.clientsService.findAll(paginationQuery);
    return {
      data: clients,
      total,
      page: parseInt(paginationQuery.page || '1'),
      limit: parseInt(paginationQuery.limit || '10'),
      totalPages: Math.ceil(total / parseInt(paginationQuery.limit || '10')),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching client by ID: ${id}`);
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Outro cliente com este e-mail já existe.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    this.logger.log(
      `Updating client ${id} with data: ${JSON.stringify(updateClientDto)}`,
    );
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para exclusão bem-sucedida
  @ApiOperation({ summary: 'Exclui um cliente pelo ID' })
  @ApiResponse({ status: 204, description: 'Cliente excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting client by ID: ${id}`);
    return this.clientsService.remove(id);
  }
}
