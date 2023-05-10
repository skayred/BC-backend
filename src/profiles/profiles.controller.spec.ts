import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { BCService } from '../bc.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
import { ConfigService } from '@nestjs/config';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity)
  }),
);

const bcConfig = {
  '001 - Admin': 'BC_ADMIN',
  '002 - Clinical personnel': 'BC_CLINICAL',
  '003 - Warehouse personnel': 'BC_WAREHOUSE',
};

describe('AppController', () => {
  let profilesService: ProfilesService;
  let profilesController: ProfilesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        BCService,
        {
          provide: getRepositoryToken(Profile),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Role),
          useFactory: repositoryMockFactory,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BC_ROLE_MAPPING') {
                return JSON.stringify(bcConfig);
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
    profilesController = moduleRef.get<ProfilesController>(ProfilesController);
  });

  describe('root', () => {
    it('Expect all profiles to be found', async () => {
      jest.spyOn(profilesService, 'findAll').mockImplementation(() =>
        Promise.resolve([
          { id: 1, firstName: 'First', lastName: 'Last', roles: [] },
          { id: 2, firstName: 'Second', lastName: 'Last', roles: [] },
        ]),
      );

      expect(await profilesController.find()).toHaveLength(2);
      expect((await profilesController.find())[0].firstName).toBe('First');
      expect((await profilesController.find())[1].firstName).toBe('Second');
    });

    it('Expect profile to be found by ID', async () => {
      jest.spyOn(profilesService, 'findByID').mockImplementation(() =>
        Promise.resolve({
          id: 1,
          firstName: 'First',
          lastName: 'Last',
          roles: [],
        }),
      );

      expect((await profilesController.get(1)).firstName).toBe('First');
    });
  });
});
