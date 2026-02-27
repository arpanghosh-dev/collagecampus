import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './user.model';

export interface IDayTiming {
    isOpen: boolean;
    opensAt: string | null;
    closesAt: string | null;
}

const dayTimingSchema = new Schema<IDayTiming>(
    {
        isOpen: { type: Boolean, required: true },
        opensAt: { type: String, default: null },
        closesAt: { type: String, default: null }
    },
    { _id: false }
);

export interface IOffer {
    offerId: string;
    shopId: string;
    offerName: string;
    startDate: Date;
    endDate: Date;
    description: string;
    photo: string;
}

const offerSchema = new Schema<IOffer>(
    {
        offerId: { type: String, required: true },
        shopId: { type: String, required: true },
        offerName: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (this: any, value: Date) {
                    return value >= this.startDate;
                },
                message: "End date must be after or equal to start date"
            }
        },
        description: { type: String, required: true, trim: true },
        photo: { type: String, required: true }
    },
    { _id: false }
);

export interface IContactDetails {
    email: string;
    phoneNo: string;
}

const contactDetailsSchema = new Schema<IContactDetails>(
    {
        email: { type: String, required: true },
        phoneNo: { type: String, required: true }
    },
    { _id: false }
);

export interface IShopTiming {
    monday: IDayTiming;
    tuesday: IDayTiming;
    wednesday: IDayTiming;
    thursday: IDayTiming;
    friday: IDayTiming;
    saturday: IDayTiming;
    sunday: IDayTiming;
}

const shopTimingSchema = new Schema<IShopTiming>(
    {
        monday: { type: dayTimingSchema, required: true },
        tuesday: { type: dayTimingSchema, required: true },
        wednesday: { type: dayTimingSchema, required: true },
        thursday: { type: dayTimingSchema, required: true },
        friday: { type: dayTimingSchema, required: true },
        saturday: { type: dayTimingSchema, required: true },
        sunday: { type: dayTimingSchema, required: true }
    },
    { _id: false }
);

export interface IShop extends Document {
    name: string;
    createdBy: IUser['_id'];
    shopId: string;
    type: string;
    location: string;
    distance?: string;
    photo?: string;
    photos?: string[];
    poster?: string;
    topItems?: string[];
    allItems?: string[];
    contactDetails: IContactDetails;
    shopTiming: IShopTiming;
    offers?: IOffer[];
    createdAt: Date;
    updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
    {
        name: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        shopId: { type: String, required: true, unique: true },
        type: { type: String, required: true },
        location: { type: String, required: true },
        distance: { type: String },
        photo: { type: String },
        photos: [{ type: String }],
        poster: { type: String },
        topItems: [{ type: String }],
        allItems: [{ type: String }],
        contactDetails: { type: contactDetailsSchema, required: true },
        shopTiming: { type: shopTimingSchema, required: true },
        offers: [offerSchema]
    },
    {
        timestamps: true
    }
);

export const Shop: Model<IShop> = mongoose.model<IShop>('Shop', shopSchema);