import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const isProduction = process.env.NODE_ENV === "production";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal Server Error";
  let error: any = undefined;

  /* ---------- Prisma Validation Error ---------- */
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "You provided incorrect field type or missing fields";
    error = {
      name: err.name,
      clientVersion: err.clientVersion,
      message: err.message,
    };
  }

  /* ---------- Prisma Known Request Error ---------- */
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        statusCode = 404;
        message =
          "An operation failed because it depends on one or more records that were required but not found.";
        break;

      case "P2002":
        statusCode = 409;
        message = "Duplicate key error";
        break;

      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;

      default:
        statusCode = 400;
        message = "Database request error";
    }

    error = {
      code: err.code,
      meta: err.meta,
      clientVersion: err.clientVersion,
      name: err.name,
    };
  }

  /* ---------- Prisma Unknown Error ---------- */
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Error occurred during query execution";
    error = {
      name: err.name,
      clientVersion: err.clientVersion,
    };
  }

  /* ---------- Prisma Init Error ---------- */
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = err.errorCode === "P1000" ? 401 : 503;
    message =
      err.errorCode === "P1000"
        ? "Authentication failed. Please check your credentials"
        : "Cannot reach database server";

    error = {
      errorCode: err.errorCode,
      clientVersion: err.clientVersion,
      name: err.name,
    };
  }

  /* ---------- Generic JS Error ---------- */
  else if (err instanceof Error) {
    error = {
      name: err.name,
      message: err.message,
    };
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error }),
    ...(!isProduction &&
      err instanceof Error && {
        stack: err.stack,
      }),
  });
}


// function errorHandler(
//     err: any,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     let statusCode = 500;
//     let errorMessage = "Internal Server Error";
//     let errorDetails = err;

//     // PrismaClientValidationError
//     if (err instanceof Prisma.PrismaClientValidationError) {
//         statusCode = 400;
//         errorMessage = "You provide incorrect field type or missing fields!"
//     }
//     // PrismaClientKnownRequestError
//     else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//         if (err.code === "P2025") {
//             statusCode = 400;
//             errorMessage = "An operation failed because it depends on one or more records that were required but not found."
//         }
//         else if (err.code === "P2002") {
//             statusCode = 400;
//             errorMessage = "Duplicate key error"
//         }
//         else if (err.code === "P2003") {
//             statusCode = 400;
//             errorMessage = "Foreign key constraint failed"
//         }
//     }
//     else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
//         statusCode = 500;
//         errorMessage = "Error occurred during query execution"
//     }
//     else if (err instanceof Prisma.PrismaClientInitializationError) {
//         if (err.errorCode === "P1000") {
//             statusCode = 401;
//             errorMessage = "Authentication failed. Please check your creditials!"
//         }
//         else if (err.errorCode === "P1001") {
//             statusCode = 400;
//             errorMessage = "Can't reach database server"
//         }
//     }

//     res.status(statusCode)
//     res.json({
//         message: errorMessage,
//         error: errorDetails
//     })
// }


export default errorHandler;
