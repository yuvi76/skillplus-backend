import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  estimatedPrice: number;

  @Prop({ required: true })
  duration: number; // in hours

  @Prop()
  thumbnail: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  instructor: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  students: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Review' })
  reviews: string[];

  @Prop()
  category: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Content' })
  content: string[];

  @Prop()
  tags: string[]; // Array of tags for Search functionality

  @Prop({ default: 0 })
  ratings: number;

  @Prop({ type: String, default: 'English' })
  language: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: true })
  isFree: boolean;

  @Prop({ default: 0 })
  totalSales: number;
}

export const CourseModel = SchemaFactory.createForClass(Course);
