import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('restaurants/:restaurantId/menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles('admin')
  @Post()
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuService.create(restaurantId, dto);
  }

  @Get()
  findAll(@Param('restaurantId') restaurantId: string) {
    return this.menuService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  findOne(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
  ) {
    return this.menuService.findOne(restaurantId, id);
  }

  @Roles('admin')
  @Put(':id')
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.update(restaurantId, id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
  ) {
    return this.menuService.remove(restaurantId, id);
  }
}
