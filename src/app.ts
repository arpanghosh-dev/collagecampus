import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import shopRoutes from "./routes/shop.routes";
import jobRoutes from "./routes/job.routes";
import { setupSwagger } from "./swagger";
import { globalErrorHandler } from "./middlewares/error.middleware";


const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);


app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/jobs", jobRoutes);

app.use(globalErrorHandler);

export default app;