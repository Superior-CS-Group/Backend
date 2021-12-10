import EmailSettingModel from "../../model/emailSettingModel.js";
import UserModel from "../../model/customerModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import services from "../../utils/services.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import base64ToFile from "../../utils/base64ToFile.js";
import sharp from "sharp";

export const updateEmailSetting = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;
    console.log(`${req.protocol}://${req.hostname}`);
    const currentUser = await StaffModel.findById(userId);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }
    const existingEmail = await EmailSettingModel.find();

    if (existingEmail.length) {
      let profileImg = "";
      if (req.body.profileImage) {
        profileImg = await base64ToFile(
          req.body.profileImage,
          currentUser._id,
          "crmlogo"
        );
        console.log(profileImg, "urlprofileImage");

      //  const thumpThumb = await sharp(profileImg)
      //     .resize({
      //       width: 150,
      //       height: 97,
      //     })
      //     .toFile("sammy-resized.png");
      //     console.log(thumpThumb)
      } else {
        profileImg = req.body.oldLogo;
      }

      await EmailSettingModel.findByIdAndUpdate(
        {
          _id: existingEmail[0]._id,
        },
        {
          $set: {
            host: req.body.host,
            username: req.body.username,
            password: req.body.password,
            fromEmail: req.body.fromEmail,
            logo: profileImg,
          },
        }
      );
    } else {
      await EmailSettingModel.create(req.body);
    }

    const existingEmail1 = await EmailSettingModel.find();

    res.status(200).json({ msg: "success", Data: existingEmail1 });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getEmailSetting = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;
    console.log(userId);
    const currentUser = await StaffModel.findById(userId);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }
    const existingEmail = await EmailSettingModel.find();

    res.status(200).json({ msg: "success", Data: existingEmail });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const token = req.body.token;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  console.log(req.body);

  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    if (newPassword != confirmPassword) {
      return res
        .status(401)
        .json({ error: "Password and Confirm Password does not match!" });
    }

    const decoded = await promisify(jwt.verify)(token, services.JWT_KEY);

    const currentUser = await UserModel.findById(decoded._id);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    let newpassword = await bcrypt.hash(newPassword, salt);

    if (!bcrypt.compareSync(currentPassword, currentUser.password)) {
      return res.status(401).json({ error: "Current Password are incorrect " });
    }

    await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: {
          password: newpassword,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully Password Changed!",
      user: currentUser,
    });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};
