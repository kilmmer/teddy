import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ClientsService implements OnModuleInit {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @Inject('RABBITMQ_CLIENT') // Injeta o cliente RabbitMQ
    private client: ClientProxy,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error); // Considere uma estratégia de retry ou notificação aqui
    }
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const newClient = this.clientsRepository.create(createClientDto);
    const savedClient = await this.clientsRepository.save(newClient);

    this.client.emit('client.created', {
      // 'client.created' é o nome do padrão do evento
      clientId: savedClient.id, // O ID real do cliente salvo no DB
      name: savedClient.name,
      email: savedClient.email,
      salary: savedClient.salary,
      company: savedClient.company,
      timestamp: new Date(), // Adicione um timestamp para rastreamento
    });

    return savedClient;
  }

  async findAll(
    paginationQuery?: PaginationQueryDto,
  ): Promise<{ clients: Client[]; total: number }> {
    const { page = '1', limit = '10', search } = paginationQuery || {};
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (search) {
      where['name'] = Like(`%${search}%`);
    }

    const cacheKey = `clients:${page}:${limit}:${search || ''}`;
    const cachedData = await this.cacheManager.get<{
      clients: Client[];
      total: number;
    }>(cacheKey);

    if (cachedData) {
      console.log('Retornando dados do cache (Nest Cache)');
      return cachedData;
    }

    const [clients, total] = await this.clientsRepository.findAndCount({
      where,
      take,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    const result = { clients, total };

    await this.cacheManager.set(cacheKey, result, 60); // cache por 60 segundos
    console.log('Dados armazenados no cache (Nest Cache)');

    return result;
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found.`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found.`);
    }

    // Atualiza os dados do cliente
    this.clientsRepository.merge(client, updateClientDto);
    const updatedClient = await this.clientsRepository.save(client);

    // 🚀 Publica no RabbitMQ APÓS atualizar no DB
    this.client.emit('client.updated', {
      // Novo evento!
      clientId: updatedClient.id,
      name: updatedClient.name,
      email: updatedClient.email,
      salary: updatedClient.salary,
      company: updatedClient.company,
      timestamp: new Date(),
    });
    console.log(
      `Evento 'client_updated' emitido para RabbitMQ para ${updatedClient.id}`,
    );

    // Limpa o cache após atualização do cliente
    await this.cacheManager.del(`clients:${updatedClient.id}`);
    console.log('Cache limpo após atualização do cliente');

    return updatedClient;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID "${id}" not found.`);
    }
    // Limpa o cache após remoção do cliente
    await this.cacheManager.del(`clients:${id}`);
    console.log('Cache limpo após remoção do cliente');
  }
}
