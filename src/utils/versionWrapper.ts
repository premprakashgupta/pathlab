// utils/versionWrapper.ts
import { Request, Response, NextFunction } from "express";
import ApiError from "./api.error";

// Version handler wrapper
const versionWrapper = (versions: { [key: string]: Function }) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const apiVersion = req.originalUrl.split("/")[3];
    console.log("version: ",apiVersion)
    // Check if the version exists in the versions object
    if (versions[apiVersion]) {
      try {
        // Call the corresponding versioned controller function
        await versions[apiVersion](req, res);
      } catch (error) {
        next(error); // Pass errors to the global error handler
      }
    } else {
      // If the version is not found, respond with an error
      next(new ApiError("API version not defined", 404));
    }
  };
};

export default versionWrapper;
