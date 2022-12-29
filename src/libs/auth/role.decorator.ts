import { RoleData } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

export type AllowedRoles = keyof typeof RoleData;

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
