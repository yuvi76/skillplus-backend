import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: string;

  @Prop({
    type: [
      {
        content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
        completed: { type: Boolean, default: false },
        lecturesProgress: [
          {
            lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
            completed: { type: Boolean, default: false },
          },
        ],
      },
    ],
    default: [],
  })
  contentsProgress: Array<{
    content: string;
    completed: boolean;
    lecturesProgress: Array<{
      lecture: string;
      completed: boolean;
    }>;
  }>;

  @Prop({ default: false })
  courseCompleted: boolean;
}

export const ProgressModel = SchemaFactory.createForClass(Progress);
