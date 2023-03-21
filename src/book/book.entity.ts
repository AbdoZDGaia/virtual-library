import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({
  timestamps: true
})
export class Book extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  category: string;
}

export const BookSchema = SchemaFactory.createForClass(Book).plugin(softDeletePlugin);
