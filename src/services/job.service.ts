import { Job, IJob } from "../models/job.model";
import { AppError } from "../utils/appError";
import { QueryFilter } from "mongoose";

export const createJob = async (data: Partial<IJob>, userId: string) => {
    const job = await Job.create({
        ...data,
        createdBy: userId
    });
    return job;
};

export const updateJob = async (jobId: string, data: Partial<IJob>) => {
    const job = await Job.findOneAndUpdate({ jobId }, data, { new: true, runValidators: true });
    if (!job) throw new AppError("Job not found", 404);
    return job;
};

export const deleteJob = async (jobId: string) => {
    const job = await Job.findOneAndDelete({ jobId });
    if (!job) throw new AppError("Job not found", 404);
    return job;
};

export const getJobs = async (page: number = 1, limit: number = 10, search?: string) => {
    const query: QueryFilter<IJob> = {};
    if (search) {
        query.jobName = { $regex: search, $options: 'i' };
    }

    const jobs = await Job.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    return {
        jobs,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getJobById = async (jobId: string) => {
    const job = await Job.findOne({ jobId });
    if (!job) throw new AppError("Job not found", 404);
    return job;
};
