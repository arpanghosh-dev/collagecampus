import { z } from "zod";
import { JobType } from "../models/job.model";

const contactDetailsSchema = z.object({
    email: z.string().email(),
    phoneNo: z.string()
});

const salarySchema = z.object({
    from: z.number().min(0),
    to: z.number().min(0)
});

export const createJobSchema = z.object({
    jobName: z.string().min(1),
    jobId: z.string().min(1),
    jobProvider: z.string().min(1),
    type: z.nativeEnum(JobType),
    deadline: z.string().transform((val) => new Date(val)),
    location: z.string().min(1),
    experience: z.number().min(0),
    salary: salarySchema,
    jobDescription: z.string().min(1),
    responsibilities: z.array(z.string()).min(1),
    contactDetails: contactDetailsSchema
});

export const updateJobSchema = createJobSchema.partial();
