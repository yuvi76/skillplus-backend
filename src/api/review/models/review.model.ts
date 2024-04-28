import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Number, min: 1, max: 5 })
  rating: number;

  @Prop()
  review: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: string;

  @Prop()
  reply: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  repliedBy: string;
}

export const ReviewModel = SchemaFactory.createForClass(Review);
