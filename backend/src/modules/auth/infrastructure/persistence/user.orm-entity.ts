import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserRole } from '../../domain/enums/user-role.enum';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'nombre_completo', type: 'varchar', length: 150 })
  nombreCompleto!: string;

  @Column({ name: 'correo', type: 'varchar', length: 255, unique: true })
  correo!: string;

  @Column({ name: 'telefono', type: 'varchar', length: 30 })
  telefono!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENTE })
  rol!: UserRole;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
