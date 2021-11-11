import UserModel from "../../model/customerModel.js"; 
import jwt from "jsonwebtoken";

export const dashboardSettings = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;
    console.log(userId)
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const userData = await UserModel.find({userRole:"user"}).sort({_id:-1}); 

    res.status(200).json({
      userDataLength: userData.length,
      userData: userData, 
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
