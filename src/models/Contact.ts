import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  read: boolean;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", contactSchema);
