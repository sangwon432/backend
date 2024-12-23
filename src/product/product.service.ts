import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);
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
}
