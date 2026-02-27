# Backend Architecture & Error Handling Flow

## Architecture Layers

    routes → controller → service → (throw AppError)
                                  ↓
                            asyncHandler
                                  ↓
                         globalErrorHandler
                                  ↓
                           ErrorResponse
                                  ↓
                                Client

------------------------------------------------------------------------

## 1️⃣ Route Layer → `routes/auth.routes.ts`

Example:

``` ts
router.post("/login", validate(loginSchema), loginController);
```

### Flow:

-   Client sends `POST /api/auth/login`
-   Express matches route
-   Middlewares execute in order:
    -   `validate.middleware`
    -   `loginController` (wrapped with `asyncHandler`)

------------------------------------------------------------------------

## 2️⃣ Controller Layer → `controllers/auth.controller.ts`

Example:

``` ts
export const loginController = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  SuccessResponse.send(res, user, "Login successful");
});
```

### Key Concept

Controller is wrapped with:

``` ts
asyncHandler(...)
```

This ensures all async errors are automatically forwarded to the global
error handler.

------------------------------------------------------------------------

## 3️⃣ Service Layer → `services/auth.service.ts`

Example:

``` ts
export const login = async (data: LoginDto) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
};
```

### Responsibility

-   Contains business logic
-   Throws `AppError` when something fails
-   Does NOT send responses

------------------------------------------------------------------------

## 4️⃣ asyncHandler → `utils/asyncHandler.ts`

Typical Implementation:

``` ts
export const asyncHandler =
  (fn: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

### What It Does

If a service throws:

``` ts
throw new AppError(...)
```

It automatically becomes:

``` ts
.catch(next)
```

Which forwards the error to:

    globalErrorHandler

------------------------------------------------------------------------

## 5️⃣ Global Error Handler → `middlewares/error.middleware.ts`

``` ts
export const globalErrorHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof AppError) {
    return ErrorResponse.send(
      res,
      err.message,
      err.statusCode
    );
  }

  console.error(err);

  return ErrorResponse.send(
    res,
    "Internal Server Error",
    500
  );
};
```

### Responsibilities

-   Detects `AppError`
-   Formats error
-   Sends final JSON response
-   Must be registered LAST in `app.ts`

``` ts
app.use(globalErrorHandler);
```

------------------------------------------------------------------------

## 6️⃣ ErrorResponse → `utils/apiResponse.ts`

Formats error response like:

``` json
{
  "code": 404,
  "success": false,
  "message": "User not found",
  "data": null
}
```

------------------------------------------------------------------------

# Complete Runtime Example

### Scenario: Login with Wrong Email

### Step 1 → Route

`POST /api/auth/login`

### Step 2 → Controller

Calls:

    authService.login()

### Step 3 → Service

User not found:

    throw new AppError("User not found", 404, "USER_NOT_FOUND");

### Step 4 → asyncHandler

    next(err)

### Step 5 → globalErrorHandler

Detects `AppError` and formats response.

### Step 6 → Client Receives:

``` json
{
  "code": 404,
  "success": false,
  "message": "User not found",
  "data": null
}
```

------------------------------------------------------------------------

# Why This Architecture Is Powerful

-   Controllers stay clean
-   No repetitive try/catch blocks
-   Services focus only on business logic
-   Single centralized error response
-   Easy to log and extend
-   Follows clean architecture principles

------------------------------------------------------------------------

# Error Ownership Responsibility Matrix

  Layer                Responsibility
  -------------------- -----------------------------------
  Service              Business logic + throw `AppError`
  Controller           Call service + send success
  asyncHandler         Forward async errors
  globalErrorHandler   Decide response format
  ErrorResponse        Format JSON

------------------------------------------------------------------------

# Final Summary

Each layer has a single responsibility.

This separation ensures:

-   Maintainability
-   Scalability
-   Predictable error handling
-   Clean, professional backend structure