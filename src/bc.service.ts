import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BCService {
  // Map of the external role name mapping to the internal role. Keys are external roles, values are internal roles
  public readonly roleMappings: { [index: string]: string };

  constructor(private configService: ConfigService) {
    const mappingString = configService.get('BC_ROLE_MAPPING');

    if (!mappingString) {
      console.error(
        'BC Role mapping not found! Make sure BC_ROLE_MAPPING env variable is set!',
      );
    }

    this.roleMappings = JSON.parse(mappingString);
  }

  externalRoles(): string[] {
    return Object.keys(this.roleMappings);
  }

  internalRoles(): string[] {
    return Object.values(this.roleMappings);
  }

  roleByExternalRole(externalRole: string): string {
    if (externalRole in this.roleMappings) {
      return this.roleMappings[externalRole];
    }

    return null;
  }
}
