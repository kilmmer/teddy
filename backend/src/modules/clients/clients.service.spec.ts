import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

const mockClientRepository = {
  find: jest.fn(),
};

describe('ClientsService', () => {
  let service: ClientsService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = [
        {
          id: 1,
          name: 'Test Client',
          email: 'test@example.com',
          salary: '5000',
          company: 'Test Co',
        },
      ];
      mockClientRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no clients are found', async () => {
      const result: Client[] = [];
      mockClientRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
