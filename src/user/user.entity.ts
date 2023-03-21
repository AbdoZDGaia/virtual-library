import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true
})
export class User extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop()
  password: string;

  @Prop()
  reservedBooks: { bookName: string; reservationDate: Date }[];

  @Prop({ enum: ['admin', 'standard'], default: 'standard' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);