import { UserRole } from '../enums/user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public nombreCompleto: string,
    public correo: string,
    public telefono: string,
    public passwordHash: string,
    public rol: UserRole,
    public activo: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
