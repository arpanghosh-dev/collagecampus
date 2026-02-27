import { Router } from "express";
import * as controller from "../controllers/shop.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createShopSchema, updateShopSchema, createOfferSchema, updateOfferSchema } from "../validators/shop.validator";

const router = Router();

// Publicly available for authenticated users
router.get("/", protect, controller.getShops);
router.get("/:shopId", protect, controller.getShopById);

// Admin only routes
router.post("/", protect, authorize("ADMIN"), validate(createShopSchema), controller.createShop);
router.put("/:shopId", protect, authorize("ADMIN"), validate(updateShopSchema), controller.updateShop);
router.delete("/:shopId", protect, authorize("ADMIN"), controller.deleteShop);

// Offer management
router.post("/:shopId/offers", protect, authorize("ADMIN"), validate(createOfferSchema), controller.addOffer);
router.put("/:shopId/offers/:offerId", protect, authorize("ADMIN"), validate(updateOfferSchema), controller.updateOffer);
router.delete("/:shopId/offers/:offerId", protect, authorize("ADMIN"), controller.deleteOffer);

export default router;
