import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './application/commands/create-product.command';
import { UpdateProductCommand } from './application/commands/update-product.command';
import { DeleteProductCommand } from './application/commands/delete-product.command';
import { GetProductQuery } from './application/queries/get-product.query';
import { ListProductsQuery } from './application/queries/list-products.query';
import { CreateProductDTO } from './dtos/create-product.dto';
import { AuthGuard } from '../user/infrastructure/security/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDTO): Promise<void> {
    const { name, description, price, stock } = dto;
    await this.commandBus.execute(
      new CreateProductCommand(name, description, price, stock),
    );
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<any> {
    return this.queryBus.execute(new GetProductQuery(id));
  }

  @Get()
  async listProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any[]> {
    return this.queryBus.execute(new ListProductsQuery(page, limit));
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: CreateProductDTO,
  ): Promise<void> {
    const { name, description, price, stock } = dto;
    await this.commandBus.execute(
      new UpdateProductCommand(id, name, description, price, stock),
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteProductCommand(id));
  }
}
