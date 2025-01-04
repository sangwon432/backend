import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly minioClientService: MinioClientService,
  ) {}

  // async updateProfileImgs(productId string, images?: BufferedFile[]) {
  // const product = await this.productRepository.findOneBy({ id: productId });
  // const categoryName = "product-images"
  // const uploadedImages =  await this.minioClientService.uploadProductImgs(
  //     productId,
  //     images,
  //     categoryName
  // )
  // product.productImgs = this.uploadedImages
  //
  // return product
  //
  // }

  async createProduct(
    createProductDto: CreateProductDto,
    images?: BufferedFile[],
  ) {
    const newProduct = await this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);
    if (images) {
      const categoryName = 'product-images';
      const uploadedImgs = await this.minioClientService.uploadProductImgs(
        newProduct,
        images,
        categoryName,
      );
      newProduct.productImgs = uploadedImgs;
      await this.productRepository.save(newProduct);
    }

    return newProduct;
  }

  async getProducts() {
    const products = await this.productRepository.find();
    return products;
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (product) return product;
    throw new HttpException('no product', HttpStatus.NOT_FOUND);
  }

  async deleteProductById(productId: string) {
    const deleteResponse = await this.productRepository.delete({
      id: productId,
    });

    if (!deleteResponse.affected) {
      throw new HttpException('no product', HttpStatus.NOT_FOUND);
    }
    return `deleted ${productId}`;
  }

  async updateProductById(id: string, updateProductDto: CreateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (updatedProduct) return updatedProduct;
    throw new HttpException('no product', HttpStatus.NOT_FOUND);
  }

  // async updateProfileImgs(productId string, images?: BufferedFile[]) {
  // const product = await this.productRepository.findOneBy({ id: productId });
  // const categoryName = "product-images"
  // const uploadedImages =  await this.minioClientService.uploadProductImgs(
  //     productId,
  //     images,
  //     categoryName
  // )
  // product.productImgs = this.uploadedImages
  //
  // return product
  //
  // }
}
