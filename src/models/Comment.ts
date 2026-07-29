import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  blog: Types.ObjectId;
  name: string;
  email: string;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
}

const commentSchema = new Schema<IComment>(
  {
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", commentSchema);
