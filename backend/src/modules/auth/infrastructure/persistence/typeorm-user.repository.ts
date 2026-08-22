import type { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserOrmEntity } from './user.orm-entity';

export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly repository: Repository<UserOrmEntity>) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(correo: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { correo } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const savedEntity = await this.repository.save(this.toOrm(user));
    return this.toDomain(savedEntity);
  }

  private toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.nombreCompleto,
      entity.correo,
      entity.telefono,
      entity.passwordHash,
      entity.rol,
      entity.activo,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toOrm(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.nombreCompleto = user.nombreCompleto;
    entity.correo = user.correo;
    entity.telefono = user.telefono;
    entity.passwordHash = user.passwordHash;
    entity.rol = user.rol;
    entity.activo = user.activo;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}
