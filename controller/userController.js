import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import UserModel from "../model/staff/staffModel.js";
import EmailSettingModel from "../model/emailSettingModel.js";
import validateSignUpInput from "../validator/signUp.validator.js";
import services from "../utils/services.js";
import sendEmail from "../utils/sendEmail.js";
import sendAdmimEmail from "../utils/sendEmail.js";
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
      name: req.body.name,
      companyName: req.body.companyName,
      contactNo: req.body.contactNo,
      currency: "USD",
      timeZone: "(GMT +8) Pacific Standard Time",
    });

    // Sent email to activate account
    const emailSettingData = await EmailSettingModel.findOne();
    // console.log(emailSettingData);
    var ndate = new Date();
    var hours = ndate.getHours();
    var format = "";
    var ndate = new Date();
    var hr = ndate.getHours();
    var h = hr % 12;
    let greet;
    if (hr < 12) {
      greet = "Morning";
      format = "AM";
    } else if (hr >= 12 && hr <= 17) {
      greet = "Afternoon";
      format = "PM";
    } else if (hr >= 17 && hr <= 24) {
      greet = "Evening";
    }

 

 const message = `<html>
     <head>
        <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>One Percent </title>
        <style>html,body{background-color:#fff!important;margin:0 auto !important;padding:0 !important;height:100% !important;width:100% !important;color:#888!important}.email-container{max-width:600px!important;border: 1px solid #B5BECA;
      border-radius: 12px;margin:0 auto!important}*{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}div[style*="margin: 16px 0"]{margin:0 !important}table,td{mso-table-lspace:0pt !important;mso-table-rspace:0pt !important}table{width:100%;border-spacing:0 !important;border-collapse:collapse !important;table-layout:fixed !important;margin:0 auto !important}img{-ms-interpolation-mode:bicubic}a{text-decoration:none!important}*[x-apple-data-detectors], .unstyle-auto-detected-links *,.aBn{border-bottom:0 !important;cursor:default !important;color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-weight:inherit !important;line-height:inherit !important}@media only screen and (min-device-width: 320px) and (max-device-width: 374px){u ~ div .email-container{min-width:320px !important}}@media only screen and (min-device-width: 375px) and (max-device-width: 413px){u ~ div .email-container{min-width:375px !important}}@media only screen and (min-device-width: 414px){u ~ div .email-container{min-width:414px !important}}</style>
     </head>
     <body>
        <div class="email-container">
             <table style="background-color: #E8F1FD;border-top-right-radius:10px;border-top-left-radius:10px; ">
              <tr>
                 <td style="padding: 30px 15px; border-top-right-radius: 10px"><img src="${emailSettingData.logo}""/>
                    
                 </td>
                                
              </tr>
           </table>
           <table style="color: #000;font-size: 20px; ">
              <tr>
                 <td style="padding: 10px 14px;"><h4>Sign Up Request</h4></td>
              </tr>
              <tr>
                 <td style="padding: 10px 14px;">Good ${greet}, <b>${req.body.name}</b>,</td>
              </tr>
              <tr>
                 <td style="padding: 10px 14px;">Thank you for Application, Now Your application is Pending.</td>
              </tr><tr>
              
                 <td style="padding: 10px 14px;"> We will Notify you when Admin Approved your Account.</td>
              </tr>
  
  
                          <tr>
                 <td style="padding: 5px 14px;">Sincerely
  </td>
              </tr>
                          <tr>
                 <td style="padding: 10px 14px;">The One Percent Software Team
  </td>
              </tr>
           </table>
            
           <table style="background-color: #E8F1FD; font-size: 20px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;">
              <tr>
                 <td style=" text-align: center;">You're receiving this email because you are a subscriber of TheOnePercent.com </td>
              </tr>
              <tr>
                 <td style="padding-bottom: 20px; text-align: center;">If you feel you received it by mistake or wish to unsubscribe,<a href="#" style="color: deepskyblue;"><b> click here</b></a></td>
              </tr>
           </table>
        </div>
     </body>
  </html>`;

     sendEmail({
      email: newUser.email,
      subject: "New Account",
      message,
    });

     sendAdmimEmail({
      email: newUser.email,
      subject: "New User Account",
      message,
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
        // const payload = {
        //   _id: newUser._id,
        //   email: newUser.email,
        // };
        // const token = jwt.sign(payload, services.JWT_KEY, {
        //   expiresIn: 31556926,
        // });

        // let profileImage = "";
        // if (req.body.profileImage) {
        //   profileImage = await base64ToFile(
        //     req.body.profileImage,
        //     newUser._id,
        //     profileImage,
        //     req
        //   );
        // } else {
        //   profileImage = "";
        // }

        // let companyImage = "";
        // if (req.body.companyImage) {
        //   companyImage = await base64ToFile(
        //     req.body.companyImage,
        //     newUser._id,
        //     companyImage,
        //     req
        //   );
        // } else {
        //   companyImage = "";
        // }

        // const userData = await UserModel.findByIdAndUpdate(
        //   { _id: newUser._id },
        //   {
        //     $set: { profileImage: profileImage, companyImage: companyImage },
        //   },
        //   { new: true }
        // );

        return res.status(200).json({
          message: "User registred Successfully",
          // token: token,
          user: newUser,
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
  console.log("request", req.body);
  try {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const details = {};
    if (req.body.email.match(re)) {
      details.email = req.body.email;
    } else {
      details.username = req.body.email;
    }

    if (req.body.email === "" || req.body.password === "") {
      return res.status(401).json({ error: "Fields are not blank!" });
    }

    const user = await UserModel.findOne(details);
    if (!user) {
      return res.status(401).json({ error: "Organization  not found" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Password are incorrect " });
    }
    if (!user.activeStatus) {
      return res.status(401).json({ error: "Account not activate!" });
    }
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
      message: "Organization logged in Successfully",
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
      token: token,
      user: user,
    });
  } catch (error) {
    console.log("GetUserDetails: ", error);
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
          email: req.body.email,
          name: req.body.name,
          companyName: req.body.companyName,
          currency: req.body.currency,
          timeZone: req.body.timeZone,
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

export const getUserList = async (req, res) => {
  const userId = req.query.userId || req.user._id;

  try {
    const user = await UserModel.find({ $ne: { userRole: "admin" } }).sort({
      _id: -1,
    });

    return res.status(200).json({
      message: "User List",
      DataLength: user.length,
      Data: user,
    });
  } catch (error) {
    console.log("GetUser: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeUserDetails = async (req, res) => {
  const userId = req.query.userId || req.user._id;

  try {
    await UserModel.findByIdAndDelete(userId);

    const user = await UserModel.find().sort({ _id: -1 });

    return res.status(200).json({
      message: "User removed",
      user: user,
    });
  } catch (error) {
    console.log("GetUserDetails: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//-------------

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

    const message = `<p>We have recieved a request to have your password reset for <b>User Account</b>. If you did not make this request, please ignore this email.  <br> 
      <br> To reset your password, please <a href = "${req.headers.origin}/change-password/${token}"> <b>Visit this link</b> </a> </p> <hr>  
      <h3> <b>Having Trouble? </b> </h3> 
      <p>If the above link does not work try copying this link into your browser. </p> 
      <p><a href="${req.headers.origin}/change-password/${token}">Click here</a></p>  <hr>
      <h3><b> Questions? <b> </h3>
      <p>Please let us know if there's anything we can help you with by replying to this email or by emailing <b>User.com</b></p>
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
  const userId = req.body.id;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log(req.body);
  try {
    if (password != confirmPassword) {
      return res
        .status(401)
        .json({ error: "Password and Confirm Password does not match!" });
    }

    // const decoded = await promisify(jwt.verify)(token, services.JWT_KEY);
    // console.log(decoded)
    const currentUser = await UserModel.findById({ _id: userId });

    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    let newpassword = await bcrypt.hash(password, salt);

    const updateOtp = await UserModel.findByIdAndUpdate(
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

    const message = `<p>We have recieved a request to have your change email for <b>User Account</b>. If you did not make this request, please ignore this email.  <br> 
      <br> To change your email, please <a href = "${req.headers.origin}/change-email/${token}"> <b>Visit this link</b> </a> </p> <hr>  
      <h3> <b>Having Trouble? </b> </h3> 
      <p>If the above link does not work try copying this link into your browser. </p> 
      <p><a href="${req.headers.origin}/change-email/${token}">Click here</a></p>  <hr>
      <h3><b> Questions? <b> </h3>
      <p>Please let us know if there's anything we can help you with by replying to this email or by emailing <b>User.com</b></p>
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

export const updateAccountStatus = async (req, res) => {
  const details = {};
  details._id = req.body.id;
  try {
    const user = await UserModel.findOne(details);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    let activestatus;
    if (user.activeStatus === true) {
      activestatus = false;
    } else {
      activestatus = true;
    }

    await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          activeStatus: activestatus,
        },
      }
    );
    const user2 = await UserModel.findById({ _id: user._id });

    return res.status(200).json({
      message: "Status Updated",
      user: user2,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateIsadminStatus = async (req, res) => {
  const details = {};
  details._id = req.body.id;

  try {
    const user = await UserModel.findOne(details);
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    let isAdmin;
    if (user.isAdmin === true) {
      isAdmin = false;
    } else {
      isAdmin = true;
    }

    await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          isAdmin: isAdmin,
        },
      }
    );
    const user2 = await UserModel.findById({ _id: user._id });

    return res.status(200).json({
      message: "Status Updated",
      user: user2,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
