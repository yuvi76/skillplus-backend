import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ROLE } from '../../../enum/role.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: ROLE.USER })
  role: ROLE;

  @Prop()
  isVerified: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course' })
  courses: string[];

  @Prop()
  resetPasswordToken: string;
}

export const UserModel = SchemaFactory.createForClass(User);

UserModel.pre('save', async function (next) {
  if (!this.avatar) {
    this.avatar = `https://ui-avatars.com/api/?name=${this.username}&background=random`;
  }
  if (this.isDirectModified('password') || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
