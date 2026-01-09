import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  // Mock objeleri oluşturuyoruz
  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('servis tanımlanmış olmalı', () => {
    expect(service).toBeDefined();
  });

  // Örnek bir login testi ekleyelim
  it('login metodu access_token dönmeli', async () => {
    const user = { id: 1, email: 'test@test.com', role: 'user' };
    const result = await service.login(user);
    
    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toEqual('mock-token');
  });
});
