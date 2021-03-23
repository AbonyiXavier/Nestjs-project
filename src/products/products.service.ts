import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async createProduct(title: string, description: string, price: number) {
    try {
      const newProduct = new this.productModel({
        title,
        description,
        price,
      });
      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProducts() {
    try {
      const product = await this.productModel.find().exec();
      return product as Product[];
    } catch (error) {
      console.log(error);
    }
  }

  async fetchSingleProduct(productId: string) {
    try {
      const product = await this.findProduct(productId);
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        // photo: product.photo
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(
    productId: string,
    title: string,
    description: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }
    if (price) {
      updatedProduct.price = price;
    }
    // if (photo) {
    //   updatedProduct.photo = photo;
    // }
    const product = await updatedProduct.save();
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      // photo: product.photo
    };
  }

  async removeProduct(prodId: string) {
    const product = await this.productModel.deleteOne({ _id: prodId }).exec();
    if (product.n === 0) {
      throw new NotFoundException(
        `Could not find product with this id: ${prodId}`,
      );
    }
    return product;
  }

  private async findProduct(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        throw new NotFoundException(
          `Could not find product with this id: ${id}`,
        );
      }
      return product;
    } catch (error) {
      return error.response;
    }
  }
}
