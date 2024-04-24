import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE } from 'src/enum/role.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  role: ROLE;

  @Prop()
  isVerified: boolean;

  @Prop()
  courses: string[];

  @Prop()
  resetPasswordToken: string;
}

export const UserModel = SchemaFactory.createForClass(User);

UserModel.pre('save', async function (next) {
  if (!this.avatar) {
    this.avatar = `https://ui-avatars.com/api/?name=${this.name}&background=random`;
  }
  if (this.isDirectModified('password') || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
