import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})
export class History extends Document {
    @Prop()
    collectionName: string;

    @Prop({ type: Object })
    document: Record<string, any>;

    @Prop()
    documentId: string;

    @Prop()
    operation: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
