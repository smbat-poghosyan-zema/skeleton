import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuItemDocument = MenuItem & Document;

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true, index: true })
  restaurant: string;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
