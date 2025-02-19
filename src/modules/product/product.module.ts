import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { TypeORMProductEntity } from './infrastructure/persistence/typeorm-product.entity';
import { TypeORMProductRepository } from './infrastructure/persistence/typeorm-product.repository';
import { CreateProductHandler } from './application/handlers/create-product.handler';
import { UpdateProductHandler } from './application/handlers/update-product.handler';
import { GetProductHandler } from './application/handlers/get-product.handler';
import { ListProductsHandler } from './application/handlers/list-products.handler';
import { DeleteProductHandler } from './application/handlers/delete-product.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([TypeORMProductEntity])],
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: TypeORMProductRepository,
    },
    CreateProductHandler,
    UpdateProductHandler,
    GetProductHandler,
    ListProductsHandler,
    DeleteProductHandler,
  ],
})
export class ProductModule {}
