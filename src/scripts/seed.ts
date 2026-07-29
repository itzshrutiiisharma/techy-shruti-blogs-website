import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Admin } from "../models/Admin";
import { Category } from "../models/Category";

const categories = [
  { name: "React", gradient: "from-cyan-400 to-blue-500" },
  { name: "Next.js", gradient: "from-fuchsia-500 to-violet-600" },
  { name: "DSA", gradient: "from-orange-400 to-pink-500" },
  { name: "Backend", gradient: "from-emerald-400 to-teal-500" },
  { name: "DevOps", gradient: "from-indigo-400 to-purple-600" },
  { name: "AI", gradient: "from-pink-500 to-rose-500" },
  { name: "Career", gradient: "from-amber-400 to-orange-500" },
  { name: "System Design", gradient: "from-blue-500 to-cyan-400" },
];

const run = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@techyshruti.com";
  const existing = await Admin.findOne({ email });

  if (!existing) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Shruti Sharma",
      email,
      password: process.env.ADMIN_PASSWORD || "changeme123",
    });
    console.log(`Admin created — email: ${email}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  for (const c of categories) {
    await Category.updateOne({ name: c.name }, { $setOnInsert: c }, { upsert: true });
  }
  console.log("Categories seeded.");

  await mongoose.disconnect();
  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
