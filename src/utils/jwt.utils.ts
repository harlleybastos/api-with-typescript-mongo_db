import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get("privateKey") as string;

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string) {
  try {
    const decode = jwt.verify(token, privateKey);
    return { valid: true, expired: false, decoded: decode };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decode: null,
    };
  }
}
