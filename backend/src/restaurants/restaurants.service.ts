import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuItem, MenuItemDocument } from '../menu/schemas/menu-item.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async create(dto: CreateRestaurantDto) {
    const created = await new this.restaurantModel(dto).save();
    return created;
  }

  findAll() {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string) {
    const rest = await this.restaurantModel.findById(id).exec();
    if (!rest) {
      throw new NotFoundException('Restaurant not found');
    }
    return rest;
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    const rest = await this.restaurantModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!rest) {
      throw new NotFoundException('Restaurant not found');
    }
    return rest;
  }

  async remove(id: string) {
    const rest = await this.restaurantModel.findByIdAndDelete(id).exec();
    if (!rest) {
      throw new NotFoundException('Restaurant not found');
    }
    await this.menuItemModel.deleteMany({ restaurant: id }).exec();
    return rest;
  }
}
