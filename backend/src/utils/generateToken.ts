import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

const generateToken = (userId: Types.ObjectId | string): string => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export default generateToken;
