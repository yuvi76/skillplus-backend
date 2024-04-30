import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ContentDocument = HydratedDocument<Content>;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Lecture' })
  lectures: string[];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: string;
}

export const ContentModel = SchemaFactory.createForClass(Content);
