import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Restaurant, RestaurantDocument } from '../restaurants/schemas/restaurant.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItemDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(restaurantId: string, dto: CreateMenuItemDto) {
    const restaurant = await this.restaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    const item = await new this.menuItemModel({
      ...dto,
      restaurant: restaurantId,
    }).save();
    return item;
  }

  findAllByRestaurant(restaurantId: string) {
    return this.menuItemModel.find({ restaurant: restaurantId }).exec();
  }

  async findOne(restaurantId: string, id: string) {
    const item = await this.menuItemModel
      .findOne({ _id: id, restaurant: restaurantId })
      .exec();
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  async update(restaurantId: string, id: string, dto: UpdateMenuItemDto) {
    const item = await this.menuItemModel
      .findOneAndUpdate({ _id: id, restaurant: restaurantId }, dto, { new: true })
      .exec();
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  async remove(restaurantId: string, id: string) {
    const item = await this.menuItemModel
      .findOneAndDelete({ _id: id, restaurant: restaurantId })
      .exec();
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }
}
