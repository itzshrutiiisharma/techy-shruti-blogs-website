import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  gradient: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    gradient: {
      type: String,
      default: "from-cyan-400 to-blue-500",
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
