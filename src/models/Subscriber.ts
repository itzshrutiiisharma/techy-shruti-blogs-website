import { Schema, model, Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Subscriber = model<ISubscriber>("Subscriber", subscriberSchema);
