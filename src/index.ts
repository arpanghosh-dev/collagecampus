import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

connectDB();

app.listen(env.PORT, () =>
  console.log(`Server running on ${env.PORT}`)
);