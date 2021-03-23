import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchemaModel } from './product.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchemaModel },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
