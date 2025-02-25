import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// Product
import { CreateProductCommand } from './application/commands/create-product.command';
import { UpdateProductCommand } from './application/commands/update-product.command';
import { DeleteProductCommand } from './application/commands/delete-product.command';
import { GetProductQuery } from './application/queries/get-product.query';
import { ListProductsQuery } from './application/queries/list-products.query';
import { CreateProductDTO } from './dtos/create-product.dto';

// Auth
import { AuthGuard } from '../auth/infrastructure/security/auth.guard';
import { PublicGuard } from '../auth/infrastructure/security/public.guard';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() dto: CreateProductDTO): Promise<void> {
    const { name, description, price, stock } = dto;
    await this.commandBus.execute(
      new CreateProductCommand(name, description, price, stock),
    );
  }

  @Get(':id')
  @UseGuards(PublicGuard)
  async getProduct(@Param('id') id: string): Promise<any> {
    return this.queryBus.execute(new GetProductQuery(id));
  }

  @Get()
  @UseGuards(PublicGuard)
  async listProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any[]> {
    return this.queryBus.execute(new ListProductsQuery(page, limit));
  }

  @Put(':id')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteProductCommand(id));
  }
}
