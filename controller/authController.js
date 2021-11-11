import jwt from "jsonwebtoken";
import services from "../utils/services.js";
import User from "../model/admin/staffModel.js";
import { promisify } from "util";

export const authProtect = async (req, res, next) => {
  
  //1. getting token and check if its there/exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in! Please log in to continue" });
  }
  //2. Verification token
  const decoded = await promisify(jwt.verify)(token, services.JWT_KEY);
  //3. check if user still exists
  const currentUser = await User.findById(decoded._id);

  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to the token does no longer exist"
    });
  }
  req.user = currentUser;
  next();
};
