import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CollageCampus API",
            version: "1.0.0",
            description: "API documentation for CollageCampus project",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                accessToken: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                AuthRegister: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        password: { type: "string", minLength: 6 },
                    },
                },
                AuthLogin: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string" },
                    },
                },
                RefreshToken: {
                    type: "object",
                    required: ["refreshToken"],
                    properties: {
                        refreshToken: { type: "string" },
                    },
                },
                ForgotPassword: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: { type: "string", format: "email" },
                    },
                },
                ResetPassword: {
                    type: "object",
                    required: ["password"],
                    properties: {
                        password: { type: "string", minLength: 6 },
                    },
                },
                Job: {
                    type: "object",
                    required: ["jobName", "jobId", "jobProvider", "type", "deadline", "location", "experience", "salary", "jobDescription", "responsibilities", "contactDetails"],
                    properties: {
                        jobName: { type: "string" },
                        jobId: { type: "string" },
                        jobProvider: { type: "string" },
                        type: { type: "string", enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] },
                        deadline: { type: "string", format: "date-time" },
                        location: { type: "string" },
                        experience: { type: "number" },
                        salary: {
                            type: "object",
                            properties: {
                                from: { type: "number" },
                                to: { type: "number" },
                            },
                        },
                        jobDescription: { type: "string" },
                        responsibilities: {
                            type: "array",
                            items: { type: "string" },
                        },
                        contactDetails: {
                            type: "object",
                            properties: {
                                email: { type: "string" },
                                phoneNo: { type: "string" },
                            },
                        },
                    },
                },
                Offer: {
                    type: "object",
                    required: ["offerId", "shopId", "offerName", "startDate", "endDate", "description", "photo"],
                    properties: {
                        offerId: { type: "string" },
                        shopId: { type: "string" },
                        offerName: { type: "string" },
                        startDate: { type: "string", format: "date-time" },
                        endDate: { type: "string", format: "date-time" },
                        description: { type: "string" },
                        photo: { type: "string" },
                    },
                },
                Shop: {
                    type: "object",
                    required: ["name", "shopId", "type", "location", "contactDetails", "shopTiming"],
                    properties: {
                        name: { type: "string" },
                        shopId: { type: "string" },
                        type: { type: "string" },
                        location: { type: "string" },
                        distance: { type: "string" },
                        photo: { type: "string" },
                        photos: { type: "array", items: { type: "string" } },
                        poster: { type: "string" },
                        topItems: { type: "array", items: { type: "string" } },
                        allItems: { type: "array", items: { type: "string" } },
                        contactDetails: {
                            type: "object",
                            properties: {
                                email: { type: "string" },
                                phoneNo: { type: "string" },
                            },
                        },
                        shopTiming: {
                            type: "object",
                            properties: {
                                monday: { $ref: "#/components/schemas/DayTiming" },
                                tuesday: { $ref: "#/components/schemas/DayTiming" },
                                wednesday: { $ref: "#/components/schemas/DayTiming" },
                                thursday: { $ref: "#/components/schemas/DayTiming" },
                                friday: { $ref: "#/components/schemas/DayTiming" },
                                saturday: { $ref: "#/components/schemas/DayTiming" },
                                sunday: { $ref: "#/components/schemas/DayTiming" },
                            },
                        },
                        offers: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Offer" },
                        },
                    },
                },
                DayTiming: {
                    type: "object",
                    properties: {
                        isOpen: { type: "boolean" },
                        opensAt: { type: "string", nullable: true },
                        closesAt: { type: "string", nullable: true },
                    },
                },
            },
        },
        paths: {
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register a new user",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegister" } } },
                    },
                    responses: { 201: { description: "User registered successfully" } },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "User login",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLogin" } } },
                    },
                    responses: { 200: { description: "Login successful" } },
                },
            },
            "/api/auth/refresh": {
                post: {
                    tags: ["Auth"],
                    summary: "Refresh tokens",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } } },
                    },
                    responses: { 200: { description: "Tokens refreshed" } },
                },
            },
            "/api/auth/logout": {
                post: {
                    tags: ["Auth"],
                    summary: "User logout",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } } },
                    },
                    responses: { 200: { description: "Logout successful" } },
                },
            },
            "/api/auth/forgot-password": {
                post: {
                    tags: ["Auth"],
                    summary: "Forgot password",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ForgotPassword" } } },
                    },
                    responses: { 200: { description: "Reset email sent" } },
                },
            },
            "/api/auth/reset-password/{token}": {
                post: {
                    tags: ["Auth"],
                    summary: "Reset password",
                    parameters: [{ name: "token", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ResetPassword" } } },
                    },
                    responses: { 200: { description: "Password reset successful" } },
                },
            },
            "/api/jobs": {
                get: {
                    security: [{ accessToken: [] }],
                    tags: ["Jobs"],
                    summary: "Get all jobs",
                    parameters: [
                        { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
                        { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Number of items per page" },
                        { name: "search", in: "query", schema: { type: "string" }, description: "Search term" },
                    ],
                    responses: { 200: { description: "List of jobs" } },
                },
                post: {
                    security: [{ accessToken: [] }],
                    tags: ["Jobs"],
                    summary: "Create a new job (Admin only)",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Job" } } },
                    },
                    responses: { 201: { description: "Job created" } },
                },
            },
            "/api/jobs/{jobId}": {
                get: {
                    security: [{ accessToken: [] }],
                    tags: ["Jobs"],
                    summary: "Get job by ID",
                    parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Job details" } },
                },
                put: {
                    security: [{ accessToken: [] }],
                    tags: ["Jobs"],
                    summary: "Update job (Admin only)",
                    parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Job" } } },
                    },
                    responses: { 200: { description: "Job updated" } },
                },
                delete: {
                    security: [{ accessToken: [] }],
                    tags: ["Jobs"],
                    summary: "Delete job (Admin only)",
                    parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Job deleted" } },
                },
            },
            "/api/shops": {
                get: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Get all shops",
                    parameters: [
                        { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
                        { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Number of items per page" },
                        { name: "search", in: "query", schema: { type: "string" }, description: "Search term" },
                    ],
                    responses: { 200: { description: "List of shops" } },
                },
                post: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Create a new shop (Admin only)",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Shop" } } },
                    },
                    responses: { 201: { description: "Shop created" } },
                },
            },
            "/api/shops/{shopId}": {
                get: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Get shop by ID",
                    parameters: [{ name: "shopId", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Shop details" } },
                },
                put: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Update shop (Admin only)",
                    parameters: [{ name: "shopId", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Shop" } } },
                    },
                    responses: { 200: { description: "Shop updated" } },
                },
                delete: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Delete shop (Admin only)",
                    parameters: [{ name: "shopId", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Shop deleted" } },
                },
            },
            "/api/shops/{shopId}/offers": {
                post: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Add offer to shop (Admin only)",
                    parameters: [{ name: "shopId", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Offer" } } },
                    },
                    responses: { 201: { description: "Offer added" } },
                },
            },
            "/api/shops/{shopId}/offers/{offerId}": {
                put: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Update offer (Admin only)",
                    parameters: [
                        { name: "shopId", in: "path", required: true, schema: { type: "string" } },
                        { name: "offerId", in: "path", required: true, schema: { type: "string" } },
                    ],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Offer" } } },
                    },
                    responses: { 200: { description: "Offer updated" } },
                },
                delete: {
                    security: [{ accessToken: [] }],
                    tags: ["Shops"],
                    summary: "Delete offer (Admin only)",
                    parameters: [
                        { name: "shopId", in: "path", required: true, schema: { type: "string" } },
                        { name: "offerId", in: "path", required: true, schema: { type: "string" } },
                    ],
                    responses: { 200: { description: "Offer deleted" } },
                },
            },
        },
    },
    apis: [], // No need to scan files if we define everything here
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
