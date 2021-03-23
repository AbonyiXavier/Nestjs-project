import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
    @Res() res: Response,
    // @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      const product = await this.productsService.createProduct(
        prodTitle,
        prodDesc,
        prodPrice,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Product Created Successfully',
        product,
      });
    } catch (error) {
      console.log(error);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    // console.log('name pay', req.user);

    try {
      const product = await this.productsService.fetchProducts();
      const prodData = product.map((prod) => ({
        id: prod.id,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        // photo: prod.photo,
      }));
      return res.json({
        message: 'All products',
        prodData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getSingleProduct(@Param('id') prodId: string) {
    try {
      const product = await this.productsService.fetchSingleProduct(prodId);
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
    // @Body('photo') prodPhoto: string,
  ): Promise<any> {
    const product = await this.productsService.updateProduct(
      prodId,
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return product;
  }
  @Delete(':id')
  async deleteProduct(
    @Param('id') prodId: string,
    @Res() res: Response,
  ): Promise<any> {
    const product = await this.productsService.removeProduct(prodId);
    return res.json({
      message: `Product with this id: ${prodId} deleted successfully`,
    });
  }
  // @Post('upload')
  // @UseInterceptors(
  //   FilesInterceptor('files', 20, {
  //     storage: diskStorage({
  //       destination: './uploads/',
  //       // filename: editFileName,
  //     }),
  //     //   fileFilter: imageFileFilter,
  //   }),
  // )
  // uploadMultipleFiles(@UploadedFiles() files) {
  //   const response = [];
  //   files.forEach((file) => {
  //     const fileReponse = {
  //       filename: file.filename,
  //     };
  //     response.push(fileReponse);
  //     console.log('files res', fileReponse);
  //     console.log('files', files);
  //   });
  //   return response;
  // }
}
