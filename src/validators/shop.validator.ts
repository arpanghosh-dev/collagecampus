import { z } from "zod";

const dayTimingSchema = z.object({
    isOpen: z.boolean(),
    opensAt: z.string().nullable(),
    closesAt: z.string().nullable()
});

const shopTimingSchema = z.object({
    monday: dayTimingSchema,
    tuesday: dayTimingSchema,
    wednesday: dayTimingSchema,
    thursday: dayTimingSchema,
    friday: dayTimingSchema,
    saturday: dayTimingSchema,
    sunday: dayTimingSchema
});

const contactDetailsSchema = z.object({
    email: z.string().email(),
    phoneNo: z.string()
});

export const createOfferSchema = z.object({
    offerId: z.string(),
    shopId: z.string(),
    offerName: z.string(),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
    description: z.string(),
    photo: z.string()
});

export const updateOfferSchema = createOfferSchema.partial();

export const createShopSchema = z.object({
    name: z.string().min(1),
    shopId: z.string().min(1),
    type: z.string().min(1),
    location: z.string().min(1),
    distance: z.string().optional(),
    photo: z.string().optional(),
    photos: z.array(z.string()).optional(),
    poster: z.string().optional(),
    topItems: z.array(z.string()).optional(),
    allItems: z.array(z.string()).optional(),
    contactDetails: contactDetailsSchema,
    shopTiming: shopTimingSchema,
    offers: z.array(createOfferSchema).optional()
});

export const updateShopSchema = createShopSchema.partial();
