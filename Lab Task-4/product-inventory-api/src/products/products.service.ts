import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity.js';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async create(
    product: CreateProductDto,
  ): Promise<{ message: string; data: Products }> {
    try {
      const prod = this.productsRepo.create({
        ...product,
        description: product.description ?? null,
        stock: product.stock ?? 0,
        isActive: product.isActive ?? true,
      });

      const result = await this.productsRepo.save(prod);

      return {
        message: 'Product created successfully',
        data: result,
      };
    } catch {
      throw new BadRequestException('Product failed to create');
    }
  }

  async findAll(): Promise<{
    message: string;
    count: number;
    data: Products[];
  }> {
    const products = await this.productsRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Products retrieved successfully',
      count: products.length,
      data: products,
    };
  }

  async findOne(
    id: number,
  ): Promise<{ message: string; data: Products }> {
    const product = await this.productsRepo.findOne({
      where: {
        id: id,
      },
    });

    if (product) {
      return {
        message: 'Product retrieved successfully',
        data: product,
      };
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const res = (await this.productsRepo.delete(id)).affected;

    if (res != null && res > 0) {
      return {
        message: `Product with id ${id} deleted`,
        id: id,
      };
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async replace(
    id: number,
    product: UpdateProductDto,
  ): Promise<{ message: string; data: Products }> {
    const prod = await this.productsRepo.findOne({
      where: {
        id: id,
      },
    });

    if (prod) {
      const res = (
        await this.productsRepo.update(id, {
          name: product.name,
          description: product.description ?? null,
          price: product.price,
          stock: product.stock ?? 0,
          category: product.category,
          isActive: product.isActive ?? true,
        })
      ).affected;

      if (res != null && res > 0) {
        const result = await this.findOne(id);

        return {
          message: `Product with id ${id} is replaced`,
          data: result.data,
        };
      } else {
        throw new BadRequestException(
          `Product with id ${id} failed to be replaced`,
        );
      }
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async update(
    id: number,
    product: PartialUpdateProductDto,
  ): Promise<{ message: string; data: Products }> {
    const prod = await this.productsRepo.findOne({
      where: {
        id: id,
      },
    });

    if (prod) {
      if (
        product.name === null ||
        product.price === null ||
        product.stock === null ||
        product.category === null ||
        product.isActive === null
      ) {
        throw new BadRequestException(
          'Only description can be set to null',
        );
      }

      if (Object.keys(product).length === 0) {
        throw new BadRequestException(
          'Provide at least one field to update',
        );
      }

      const res = (
        await this.productsRepo.update(id, product)
      ).affected;

      if (res != null && res > 0) {
        const result = await this.findOne(id);

        return {
          message: `Product with id ${id} is updated`,
          data: result.data,
        };
      } else {
        throw new BadRequestException(
          `Product with id ${id} failed to be updated`,
        );
      }
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async findByCategory(category: string): Promise<{
    message: string;
    count: number;
    data: Products[];
  }> {
    const products = await this.productsRepo.find({
      where: {
        category: category,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Products retrieved by category successfully',
      count: products.length,
      data: products,
    };
  }

  async search(keyword: string): Promise<{
    message: string;
    count: number;
    data: Products[];
  }> {
    const products = await this.productsRepo.find({
      where: {
        name: ILike(`%${keyword}%`),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Search completed successfully',
      count: products.length,
      data: products,
    };
  }

  async toggleActive(
    id: number,
  ): Promise<{ message: string; data: Products }> {
    const product = await this.productsRepo.findOne({
      where: {
        id: id,
      },
    });

    if (product) {
      product.isActive = !product.isActive;

      const result = await this.productsRepo.save(product);

      return {
        message: `Product with id ${id} active status toggled`,
        data: result,
      };
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}