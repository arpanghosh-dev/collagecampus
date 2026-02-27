import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IContactDetails {
    email: string;
    phoneNo: string;
}
const contactDetailsSchema = new Schema<IContactDetails>(
    {
        email: { type: String, required: true, trim: true },
        phoneNo: { type: String, required: true, trim: true }
    },
    { _id: false }
);

export interface ISalary {
    from: number;
    to: number;
}
const salarySchema = new Schema<ISalary>(
    {
        from: { type: Number, required: true, min: 0 },
        to: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

export enum JobType {
    PART_TIME = 'part-time',
    FULL_TIME = 'full-time'
}

export interface IJob extends Document {
    jobName: string;
    jobId: string;
    createdBy: IUser['_id'];
    jobProvider: string;
    type: JobType;
    deadline: Date;
    location: string;
    experience: number;
    salary: ISalary;
    jobDescription: string;
    responsibilities: string[];
    contactDetails: IContactDetails;
}

const jobSchema = new Schema<IJob>(
    {
        jobName: { type: String, required: true, trim: true },
        jobId: { type: String, required: true, unique: true, trim: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        jobProvider: { type: String, required: true, trim: true },
        type: {
            type: String,
            enum: Object.values(JobType),
            required: true
        },
        deadline: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        experience: { type: Number, required: true, min: 0 },
        salary: { type: salarySchema, required: true },
        jobDescription: { type: String, required: true },
        responsibilities: [{ type: String, required: true }],
        contactDetails: { type: contactDetailsSchema, required: true }
    },
    {
        timestamps: true
    }
);

export const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);