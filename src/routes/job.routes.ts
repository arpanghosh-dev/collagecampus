import { Router } from "express";
import * as controller from "../controllers/job.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createJobSchema, updateJobSchema } from "../validators/job.validator";

const router = Router();

// Publicly available for authenticated users
router.get("/", protect, controller.getJobs);
router.get("/:jobId", protect, controller.getJobById);

// Admin only routes
router.post("/", protect, authorize("ADMIN"), validate(createJobSchema), controller.createJob);
router.put("/:jobId", protect, authorize("ADMIN"), validate(updateJobSchema), controller.updateJob);
router.delete("/:jobId", protect, authorize("ADMIN"), controller.deleteJob);

export default router;