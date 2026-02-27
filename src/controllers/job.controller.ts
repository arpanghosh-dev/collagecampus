import * as jobService from "../services/job.service";
import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponse } from "../utils/apiResponse";
import { z } from "zod";
import { createJobSchema, updateJobSchema } from "../validators/job.validator";

type CreateJobBody = z.infer<typeof createJobSchema>;
type UpdateJobBody = z.infer<typeof updateJobSchema>;

export const createJob = asyncHandler(async (req: Request, res: Response) => {
    console.log("create job request", req)
    const body = req.body as CreateJobBody;
    const job = await jobService.createJob(body, String(req.user!._id));
    return SuccessResponse.send(res, job, "Job created successfully", 201);
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateJobBody;
    const job = await jobService.updateJob(req.params.jobId as string, body);
    return SuccessResponse.send(res, job, "Job updated successfully");
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
    await jobService.deleteJob(req.params.jobId as string);
    return SuccessResponse.send(res, null, "Job deleted successfully");
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await jobService.getJobs(page, limit, search);
    return SuccessResponse.send(res, result, "Jobs retrieved successfully");
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
    const job = await jobService.getJobById(req.params.jobId as string);
    return SuccessResponse.send(res, job, "Job retrieved successfully");
});
