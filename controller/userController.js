import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import UserModel from "../model/staff/staffModel.js";
import validateSignUpInput from "../validator/signUp.validator.js";
import services from "../utils/services.js";
import sendEmail from "../utils/sendEmail.js";
import base64ToFile from "../utils/base64ToFile.js";
import fs from "fs";

export const signUp = async (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // console.log("sign",req.body)
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email: req.body.email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ errors: { email: "Email Id already exists" } });
    }
    const newUser = new UserModel({
      email: req.body.email,
      companyName: req.body.companyName,
      currency: req.body.currency,
      timeZone: req.body.timeZone,
    });

    const payload1 = {
      _id: newUser._id,
    };
    let token1 = jwt.sign(payload1, services.JWT_KEY, {
      expiresIn: 31556926,
    });
    //  console.log(req.headers)

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        // console.log(err);
        return res.status(500).json({ error: err });
      }
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) {
          // console.log("err: ", err);
          return res.status(500).json({ error: err });
        }
        newUser.password = hash;
        await newUser.save();
        const payload = {
          _id: newUser._id,
          email: newUser.email,
        };
        const token = jwt.sign(payload, services.JWT_KEY, {
          expiresIn: 31556926,
        });

        let profileImage = "";
        if (req.body.profileImage) {
          profileImage = await base64ToFile(
            req.body.profileImage,
            newUser._id,
            profileImage,
            req
          );
        } else {
          profileImage = "";
        }

        let companyImage = "";
        if (req.body.companyImage) {
          companyImage = await base64ToFile(
            req.body.companyImage,
            newUser._id,
            companyImage,
            req
          );
        } else {
          companyImage = "";
        }

        const userData = await UserModel.findByIdAndUpdate(
          { _id: newUser._id },
          {
            $set: { profileImage: profileImage,companyImage: companyImage },
          },
          {new:true}
        );

        return res.status(200).json({
          message: "User registred Successfully",
          token: token,
          user: userData,
        });
      });
    });
  } catch (errors) {
    console.log("SignUp: ", errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const activateAccount = async (req, res) => {
  const token = req.body.token;
  // console.log("activateacc", token);
  try {
    const decoded = await promisify(jwt.verify)(token, services.JWT_KEY);
    const currentUser = await UserModel.findById(decoded._id);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }

    await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully Account Activated!",
      user: currentUser,
    });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  // console.log("request", req.body);
  try {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const details = {};
    if (req.body.email.match(re)) {
      details.email = req.body.email;
    } else {
      details.username = req.body.email;
    }
    const user = await UserModel.findOne(details);
    if (!user) {
      return res.status(401).json({ error: "Username  not found" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Password are incorrect " });
    }
    // if (!user.isEmailVerified) {
    //   return res.status(401).json({ error: "Account not activate!" });
    // }
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.userRole,
    };
    const token = jwt.sign(payload, services.JWT_KEY, {
      expiresIn: 31556926,
    });
    return res.status(200).json({
      message: "User logged in Successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    console.log("SignIn: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.query.userId || req.user._id;

  try {
    const user = await UserModel.findById(userId);
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(payload, services.JWT_KEY, {
      expiresIn: 31556926,
    });
    return res.status(200).json({
      message: "User details",
      // token: token,
      user: user,
    });
  } catch (error) {
    console.log("GetUserDetails: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const recoverPassword = async (req, res) => {
  const emailId = req.body.email;
  const details = {};
  details.email = emailId;
  try {
    const user = await UserModel.findOne(details);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const payload = {
      _id: user._id,
    };
    let token = jwt.sign(payload, services.JWT_KEY, {
      expiresIn: 31556926,
    });

    const updateOtp = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          password_reset_token: token,
        },
      }
    );

    const message = `<p>We have recieved a request to have your password reset for <b>Wishify Account</b>. If you did not make this request, please ignore this email.  <br> 
      <br> To reset your password, please <a href = "${req.headers.origin}/change-password/${token}"> <b>Visit this link</b> </a> </p> <hr>  
      <h3> <b>Having Trouble? </b> </h3> 
      <p>If the above link does not work try copying this link into your browser. </p> 
      <p><a href="${req.headers.origin}/change-password/${token}">Click here</a></p>  <hr>
      <h3><b> Questions? <b> </h3>
      <p>Please let us know if there's anything we can help you with by replying to this email or by emailing <b>wishify.com</b></p>
      `;

    await sendEmail({
      email: user.email,
      subject: "Recover Password",
      message,
    });

    return res.status(200).json({
      message: "Recover Password",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changePassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    if (password != confirmPassword) {
      return res
        .status(401)
        .json({ error: "Password and Confirm Password does not match!" });
    }

    const decoded = await promisify(jwt.verify)(token, services.JWT_KEY);
    // console.log(decoded)
    const currentUser = await UserModel.findById(decoded._id);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    let newpassword = await bcrypt.hash(password, salt);

    const updateOtp = await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: {
          password_reset_token: "",
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

export const changeEmail = async (req, res) => {
  const emailId = req.body.email;
  const details = {};
  details.email = emailId;
  try {
    const user = await UserModel.findOne(details);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const payload = {
      _id: user._id,
    };
    let token = jwt.sign(payload, services.JWT_KEY, {
      expiresIn: 31556926,
    });

    const updateOtp = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          email_reset_token: token,
        },
      }
    );

    const message = `<p>We have recieved a request to have your change email for <b>Wishify Account</b>. If you did not make this request, please ignore this email.  <br> 
      <br> To change your email, please <a href = "${req.headers.origin}/change-email/${token}"> <b>Visit this link</b> </a> </p> <hr>  
      <h3> <b>Having Trouble? </b> </h3> 
      <p>If the above link does not work try copying this link into your browser. </p> 
      <p><a href="${req.headers.origin}/change-email/${token}">Click here</a></p>  <hr>
      <h3><b> Questions? <b> </h3>
      <p>Please let us know if there's anything we can help you with by replying to this email or by emailing <b>wishify.com</b></p>
      `;

    await sendEmail({
      email: user.email,
      subject: "Change Email",
      message,
    });

    return res.status(200).json({
      message: "Change Email",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEmail = async (req, res) => {
  const token = req.body.token;
  const newEmail = req.body.newEmail;
  const confirmEmail = req.body.confirmEmail;

  try {
    if (!newEmail) {
      return res
        .status(400)
        .json({ error: { email: "New Email is required!" } });
    }

    if (newEmail != confirmEmail) {
      return res.status(401).json({
        error: { email: "New Email and Confirm Email does not match!" },
      });
    }

    const decoded = await promisify(jwt.verify)(token, services.JWT_KEY);
    // console.log(decoded)
    const currentUser = await UserModel.findById(decoded._id);

    if (currentUser.email_reset_token == "") {
      return res.status(401).json({ error: { email: "Link has expired" } });
    }

    if (!currentUser) {
      return res.status(401).json({ error: { email: "User not found" } });
    }
    // console.log(newEmail)
    const existingUser = await UserModel.findOne({
      $or: [{ email: newEmail }],
    });

    if (existingUser) {
      return res.status(409).json({ error: { email: "User already exists" } });
    }

    const updateOtp = await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: {
          email_reset_token: "",
          email: newEmail,
        },
      }
    );

    return res.status(200).json({
      message: "Successfully Email Changed!",
      user: currentUser,
    });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAccount = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  const body = req.body;

  try {
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }
    let profileImg = "";
    if (body.profileImage) {
      profileImg = await base64ToFile(
        body.profileImage,
        currentUser._id,
        "profilepictures"
      );
    } else {
      profileImg = currentUser.profileImage;
    }

    await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: {
          name: body.name,
          companyName: body.companyName,
          profileImage: profileImg,
        },
      }
    );
    const userData = await UserModel.findById(userId);
    // console.log(userData);
    return res.status(200).json({
      message: "Successfully Account Updated!",
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeProfileImage = async (req, res) => {
  const userId = req.query.userId || req.user._id;

  try {
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }
    const img = currentUser.profileImage;

    var lastItem = img.split("/").pop();

    const path = `public/media/users/${currentUser._id}/profilepictures/${lastItem}`;

    fs.unlinkSync(path);

    await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: {
          profileImage: "",
        },
      }
    );
    const userData = await UserModel.findById(userId);
    // console.log(userData);
    return res.status(200).json({
      message: "Successfully Remove Profile Image",
      user: userData,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const notificationSettings = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  const body = req.body;

  try {
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }
    const updates = { [req.body.name]: req.body.value };

    await UserModel.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $set: updates,
      },
      { new: true }
    );
    const userData = await UserModel.findById(userId);
    // console.log(userData);
    return res.status(200).json({
      message: "Successfully Account Updated!",
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
