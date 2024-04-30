import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LectureDocument = HydratedDocument<Lecture>;

@Schema({ timestamps: true })
export class Lecture {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  isPreview: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  })
  content: string;

  @Prop()
  resources: string[];
}

export const LectureModel = SchemaFactory.createForClass(Lecture);
