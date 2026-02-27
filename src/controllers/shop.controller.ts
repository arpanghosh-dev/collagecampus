import * as shopService from "../services/shop.service";
import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponse } from "../utils/apiResponse";
import { z } from "zod";
import { createShopSchema, updateShopSchema, createOfferSchema, updateOfferSchema } from "../validators/shop.validator";

type CreateShopBody = z.infer<typeof createShopSchema>;
type UpdateShopBody = z.infer<typeof updateShopSchema>;
type CreateOfferBody = z.infer<typeof createOfferSchema>;
type UpdateOfferBody = z.infer<typeof updateOfferSchema>;

export const createShop = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CreateShopBody;
    const shop = await shopService.createShop(body, String(req.user!._id));
    return SuccessResponse.send(res, shop, "Shop created successfully", 201);
});

export const updateShop = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateShopBody;
    const shop = await shopService.updateShop(req.params.shopId as string, body);
    return SuccessResponse.send(res, shop, "Shop updated successfully");
});

export const deleteShop = asyncHandler(async (req: Request, res: Response) => {
    await shopService.deleteShop(req.params.shopId as string);
    return SuccessResponse.send(res, null, "Shop deleted successfully");
});

export const getShops = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await shopService.getShops(page, limit, search);
    return SuccessResponse.send(res, result, "Shops retrieved successfully");
});

export const getShopById = asyncHandler(async (req: Request, res: Response) => {
    const shop = await shopService.getShopById(req.params.shopId as string);
    return SuccessResponse.send(res, shop, "Shop retrieved successfully");
});

export const addOffer = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CreateOfferBody;
    const shop = await shopService.addOffer(req.params.shopId as string, body);
    return SuccessResponse.send(res, shop, "Offer added successfully", 201);
});

export const updateOffer = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateOfferBody;
    const shop = await shopService.updateOffer(req.params.shopId as string, req.params.offerId as string, body);
    return SuccessResponse.send(res, shop, "Offer updated successfully");
});

export const deleteOffer = asyncHandler(async (req: Request, res: Response) => {
    const shop = await shopService.deleteOffer(req.params.shopId as string, req.params.offerId as string);
    return SuccessResponse.send(res, shop, "Offer deleted successfully");
});