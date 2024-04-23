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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.avatar) {
    this.avatar = `https://ui-avatars.com/api/?name=${this.name}&background=random`;
  }
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
