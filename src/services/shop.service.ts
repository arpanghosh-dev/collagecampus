import { Shop, IShop, IOffer } from "../models/shop.model";
import { AppError } from "../utils/appError";
import { QueryFilter } from "mongoose";

export const createShop = async (data: Partial<IShop>, userId: string) => {
    const shop = await Shop.create({
        ...data,
        createdBy: userId
    });
    return shop;
};

export const updateShop = async (shopId: string, data: Partial<IShop>) => {
    const shop = await Shop.findOneAndUpdate({ shopId }, data, { new: true, runValidators: true });
    if (!shop) throw new AppError("Shop not found", 404);
    return shop;
};

export const deleteShop = async (shopId: string) => {
    const shop = await Shop.findOneAndDelete({ shopId });
    if (!shop) throw new AppError("Shop not found", 404);
    return shop;
};

export const getShops = async (page: number = 1, limit: number = 10, search?: string) => {
    const query: QueryFilter<IShop> = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const shops = await Shop.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Shop.countDocuments(query);

    return {
        shops,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getShopById = async (shopId: string) => {
    const shop = await Shop.findOne({ shopId });
    if (!shop) throw new AppError("Shop not found", 404);
    return shop;
};

export const addOffer = async (shopId: string, offerData: IOffer) => {
    const shop = await Shop.findOne({ shopId });
    if (!shop) throw new AppError("Shop not found", 404);

    if (!shop.offers) shop.offers = [];
    shop.offers.push(offerData);
    await shop.save();
    return shop;
};

export const updateOffer = async (shopId: string, offerId: string, offerData: Partial<IOffer>) => {
    const shop = await Shop.findOne({ shopId });
    if (!shop) throw new AppError("Shop not found", 404);

    const offerIndex = shop.offers?.findIndex(o => o.offerId === offerId);
    if (offerIndex === undefined || offerIndex === -1) throw new AppError("Offer not found", 404);

    shop.offers![offerIndex] = { ...shop.offers![offerIndex], ...offerData };
    await shop.save();
    return shop;
};

export const deleteOffer = async (shopId: string, offerId: string) => {
    const shop = await Shop.findOne({ shopId });
    if (!shop) throw new AppError("Shop not found", 404);

    const offerIndex = shop.offers?.findIndex(o => o.offerId === offerId);
    if (offerIndex === undefined || offerIndex === -1) throw new AppError("Offer not found", 404);

    shop.offers!.splice(offerIndex, 1);
    await shop.save();
    return shop;
};
