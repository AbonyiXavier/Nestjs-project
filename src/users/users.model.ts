import { Schema, Document } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export interface User extends Document {
  id: string;
  firstname: string;
  email: string;
  password: string;
}

export const UserSchemaModel = UserSchema;
