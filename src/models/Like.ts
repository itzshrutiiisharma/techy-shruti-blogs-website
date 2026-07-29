import { Schema, model, Document, Types } from "mongoose";

export interface ILike extends Document {
  blog: Types.ObjectId;
  visitorId: string; // client-generated id (e.g. stored in localStorage) — keeps this schema simple without full user accounts
}

const likeSchema = new Schema<ILike>(
  {
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    visitorId: { type: String, required: true },
  },
  { timestamps: true }
);

// one like per visitor per blog
likeSchema.index({ blog: 1, visitorId: 1 }, { unique: true });

export const Like = model<ILike>("Like", likeSchema);
