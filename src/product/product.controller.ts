import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minio-client/file.model';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // title: string;
  // description: string;
  // price: number;
  // brand: string;
  // category: string;
  @Post('create')
  @UseInterceptors(FilesInterceptor('productImgs'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'multiple image files with additional product data',
    schema: {
      type: 'object',
      properties: {
        productImgs: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'product image file',
          },
        },
        title: {
          type: 'string',
          description: 'product name',
          example: 'iPhone 16',
        },
        description: {
          type: 'string',
          description: 'product description',
          example: 'lorem ipsum dolor sit amet',
        },
        // price: {
        //   type: 'number',
        //   description: 'product price',
        //   example: 123.45,
        // },
        brand: {
          type: 'string',
          description: 'product brand',
          example: 'mobile device',
        },
        category: {
          type: 'string',
          description: 'product category',
          example: 'mobile device',
        },
      },
    },
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images?: BufferedFile[],
  ) {
    // if (createProductDto?.price && typeof createProductDto.price === 'string') {
    //   createProductDto.price = parseFloat(createProductDto.price);
    //   if (isNaN(createProductDto.price)) {
    //     throw new BadRequestException('Invalid price format');
    //   }
    // }

    return await this.productService.createProduct(createProductDto, images);
  }

  @Get('all')
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Delete(':id')
  async deleteProductById(@Param('id') id: string) {
    return await this.productService.deleteProductById(id);
  }

  @Patch(':id')
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return await this.productService.updateProductById(id, updateProductDto);
  }

  // @Post('image/:id')
  // @UseInterceptors(FileInterceptor('images'))
  // async updateProductImg(
  //   @Param('id') id: string,
  //   @UploadedFiles() images?: BufferedFile[],
  // ) {
  //   return await this.productService.updateProfileImgs(id, images);
  // }
}
