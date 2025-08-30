import mongoose from "mongoose";

export const AUTH_TIME = 48;
export const MORGAN_STANDARD = `:method :url :response-time :status \n`;
export const SECRET_TOKEN = process.env.SECRET_TOKEN || "default_secret_token";

export const convertToMongoDbId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
