import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { BCService } from '../bc.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
import { ConfigService } from '@nestjs/config';
import { repositoryMockFactory } from './profiles.controller.spec';
import { RolesController } from './roles.controller';

const bcConfig = {
  '001 - Admin': 'BC_ADMIN',
  '002 - Clinical personnel': 'BC_CLINICAL',
  '003 - Warehouse personnel': 'BC_WAREHOUSE',
};

describe('AppController', () => {
  let profilesService: ProfilesService;
  let rolesController: RolesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RolesController],
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
    rolesController = moduleRef.get<RolesController>(RolesController);
  });

  describe('root', () => {
    it('Expect roles to be found by the profile', async () => {
      jest.spyOn(profilesService, 'findByID').mockImplementation(() =>
        Promise.resolve({
          id: 1,
          firstName: 'First',
          lastName: 'Last',
          roles: [
            { id: 1, name: 'BC_ADMIN', externalName: '001 - Admin', profileID: 1, profile: null },
            { id: 2, name: 'BC_CLINICAL', externalName: '002 - Clinical personnel', profileID: 1, profile: null }
          ],
        }),
      );

      expect((await rolesController.find(1))).toHaveLength(2);
      expect((await rolesController.find(1))[0].name).toBe('BC_ADMIN');
    });
  });

  it('Expect created, deleted and unchanged roles to be returned for NEW roles', async () => {
    jest.spyOn(profilesService, 'findByID').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        firstName: 'First',
        lastName: 'Last',
        roles: [],
      }),
    );

    const res = await rolesController.upsertRoles(1, ["002 - Clinical personnel", "003 - Warehouse personnel"]);
    expect(res.addedRoles).toHaveLength(2);
    expect(res.addedRoles[0]).toBe("BC_CLINICAL");
    expect(res.addedRoles[1]).toBe("BC_WAREHOUSE");

    expect(res.deletedRoles).toHaveLength(0);
    expect(res.unchangedRoles).toHaveLength(0);
  });

  it('Expect created, deleted and unchanged roles to be returned for SAME roles', async () => {
    jest.spyOn(profilesService, 'findByID').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        firstName: 'First',
        lastName: 'Last',
        roles: [
          { id: 1, name: 'BC_ADMIN', externalName: '001 - Admin', profileID: 1, profile: null },
          { id: 2, name: 'BC_CLINICAL', externalName: '002 - Clinical personnel', profileID: 1, profile: null }
        ],
      }),
    );

    const res = await rolesController.upsertRoles(1, ["001 - Admin", "002 - Clinical personnel"]);
    expect(res.unchangedRoles).toHaveLength(2);
    expect(res.unchangedRoles[0]).toBe("BC_ADMIN");
    expect(res.unchangedRoles[1]).toBe("BC_CLINICAL");

    expect(res.deletedRoles).toHaveLength(0);
    expect(res.addedRoles).toHaveLength(0);
  });

  it('Expect created, deleted and unchanged roles to be returned for EXISTING roles', async () => {
    jest.spyOn(profilesService, 'findByID').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        firstName: 'First',
        lastName: 'Last',
        roles: [
          { id: 1, name: 'BC_ADMIN', externalName: '001 - Admin', profileID: 1, profile: null },
          { id: 2, name: 'BC_CLINICAL', externalName: '002 - Clinical personnel', profileID: 1, profile: null }
        ],
      }),
    );

    const res = await rolesController.upsertRoles(1, ["002 - Clinical personnel", "003 - Warehouse personnel"]);
    expect(res.addedRoles).toHaveLength(1);
    expect(res.addedRoles[0]).toBe("BC_WAREHOUSE");

    expect(res.deletedRoles).toHaveLength(1);
    expect(res.deletedRoles[0]).toBe("BC_ADMIN");

    expect(res.unchangedRoles).toHaveLength(1);
    expect(res.unchangedRoles[0]).toBe("BC_CLINICAL");
  });
});
