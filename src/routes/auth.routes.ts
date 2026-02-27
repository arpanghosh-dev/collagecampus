import { Router } from "express";
import * as controller from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import * as schema from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(schema.registerSchema), controller.register);
router.post("/login", validate(schema.loginSchema), controller.login);
router.post("/refresh", validate(schema.refreshTokenSchema), controller.refresh);
router.post("/logout", validate(schema.refreshTokenSchema), controller.logout);

router.post("/forgot-password", validate(schema.forgotPasswordSchema), controller.forgot);
router.post("/reset-password/:token", validate(schema.resetPasswordSchema), controller.reset);

export default router;