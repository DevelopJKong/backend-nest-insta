import { Role } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

export type AllowedRoles = keyof typeof Role;

export const RoleData = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
