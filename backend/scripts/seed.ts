import { connect, disconnect, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserSchema, UserDocument } from '../src/users/schemas/user.schema';

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/lunchsync';
  await connect(uri);
  const UserModel = model<UserDocument>('User', UserSchema);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
    process.exit(1);
  }
  const existing = await UserModel.findOne({ email }).exec();
  if (!existing) {
    const hash = await bcrypt.hash(password, 10);
    await UserModel.create({ email, password: hash, role: 'admin' });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
  await disconnect();
}

seed();
