import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { CategoriasController } from './adapters/controllers/categorias.controller';
import { ProductosController } from './adapters/controllers/productos.controller';
import { ActualizarCategoriaUseCase } from './application/use-cases/actualizar-categoria.use-case';
import { ActualizarProductoUseCase } from './application/use-cases/actualizar-producto.use-case';
import { CrearCategoriaUseCase } from './application/use-cases/crear-categoria.use-case';
import { CrearProductoUseCase } from './application/use-cases/crear-producto.use-case';
import { EliminarCategoriaUseCase } from './application/use-cases/eliminar-categoria.use-case';
import { EliminarProductoUseCase } from './application/use-cases/eliminar-producto.use-case';
import { ListarCategoriasUseCase } from './application/use-cases/listar-categorias.use-case';
import { ListarProductosUseCase } from './application/use-cases/listar-productos.use-case';
import { ObtenerProductoUseCase } from './application/use-cases/obtener-producto.use-case';
import {
  CATEGORIA_REPOSITORY_TOKEN,
  type CategoriaRepository,
} from './application/ports/categoria.repository.port';
import {
  PRODUCTO_REPOSITORY_TOKEN,
  type ProductoRepository,
} from './application/ports/producto.repository.port';
import { CategoriaOrmEntity } from './infrastructure/persistence/categoria.orm-entity';
import { ProductoOrmEntity } from './infrastructure/persistence/producto.orm-entity';
import { TypeOrmCategoriaRepository } from './infrastructure/persistence/typeorm-categoria.repository';
import { TypeOrmProductoRepository } from './infrastructure/persistence/typeorm-producto.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CategoriaOrmEntity, ProductoOrmEntity]),
  ],
  controllers: [CategoriasController, ProductosController],
  providers: [
    {
      provide: CATEGORIA_REPOSITORY_TOKEN,
      useFactory: (
        categorias: Repository<CategoriaOrmEntity>,
        productos: Repository<ProductoOrmEntity>,
      ): CategoriaRepository =>
        new TypeOrmCategoriaRepository(categorias, productos),
      inject: [
        getRepositoryToken(CategoriaOrmEntity),
        getRepositoryToken(ProductoOrmEntity),
      ],
    },
    {
      provide: PRODUCTO_REPOSITORY_TOKEN,
      useFactory: (
        productos: Repository<ProductoOrmEntity>,
      ): ProductoRepository => new TypeOrmProductoRepository(productos),
      inject: [getRepositoryToken(ProductoOrmEntity)],
    },
    {
      provide: ListarCategoriasUseCase,
      useFactory: (repo: CategoriaRepository) =>
        new ListarCategoriasUseCase(repo),
      inject: [CATEGORIA_REPOSITORY_TOKEN],
    },
    {
      provide: CrearCategoriaUseCase,
      useFactory: (repo: CategoriaRepository) => new CrearCategoriaUseCase(repo),
      inject: [CATEGORIA_REPOSITORY_TOKEN],
    },
    {
      provide: ActualizarCategoriaUseCase,
      useFactory: (repo: CategoriaRepository) =>
        new ActualizarCategoriaUseCase(repo),
      inject: [CATEGORIA_REPOSITORY_TOKEN],
    },
    {
      provide: EliminarCategoriaUseCase,
      useFactory: (repo: CategoriaRepository) =>
        new EliminarCategoriaUseCase(repo),
      inject: [CATEGORIA_REPOSITORY_TOKEN],
    },
    {
      provide: ListarProductosUseCase,
      useFactory: (repo: ProductoRepository) => new ListarProductosUseCase(repo),
      inject: [PRODUCTO_REPOSITORY_TOKEN],
    },
    {
      provide: ObtenerProductoUseCase,
      useFactory: (repo: ProductoRepository) => new ObtenerProductoUseCase(repo),
      inject: [PRODUCTO_REPOSITORY_TOKEN],
    },
    {
      provide: CrearProductoUseCase,
      useFactory: (
        productos: ProductoRepository,
        categorias: CategoriaRepository,
      ) => new CrearProductoUseCase(productos, categorias),
      inject: [PRODUCTO_REPOSITORY_TOKEN, CATEGORIA_REPOSITORY_TOKEN],
    },
    {
      provide: ActualizarProductoUseCase,
      useFactory: (
        productos: ProductoRepository,
        categorias: CategoriaRepository,
      ) => new ActualizarProductoUseCase(productos, categorias),
      inject: [PRODUCTO_REPOSITORY_TOKEN, CATEGORIA_REPOSITORY_TOKEN],
    },
    {
      provide: EliminarProductoUseCase,
      useFactory: (repo: ProductoRepository) => new EliminarProductoUseCase(repo),
      inject: [PRODUCTO_REPOSITORY_TOKEN],
    },
  ],
  exports: [CATEGORIA_REPOSITORY_TOKEN, PRODUCTO_REPOSITORY_TOKEN],
})
export class CatalogoModule {}
