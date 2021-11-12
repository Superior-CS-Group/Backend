import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import StaffModel from "../../model/staff/staffModel.js"; 
import validateSignUpInput from "../../validator/signUp.validator.js";
import services from "../../utils/services.js";
import sendEmail from "../../utils/sendEmail.js";
import base64ToFile from "../../utils/base64ToFile.js";
import fs from "fs";



export const addStaff = async (req, res) => { 

  const { errors, isValid } = validateSignUpInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // console.log("sign",req.body)
  try {
    const existingUser = await StaffModel.findOne({
      $or: [{ email: req.body.email }],
    });
    if (existingUser) {
      return res.status(409).json({ errors: { email: "User already exists" } });
    }
    const newUser = new StaffModel({
      email: req.body.email,
      userRole:req.body.userRole
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

        return res.status(200).json({
          message: "User registred Successfully",
          token: token,
          user: newUser,
        });
      });
    });
  } catch (errors) {
    console.log("SignUp: ", errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }

};


export const membserList = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  //console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "Staff not found" });
  }
  try {
    const userData = await StaffModel.find({userRole:"user"}).sort({ _id: -1 });

    for (var i in userData) { 
      let data2 = {
        _id: userData[i]._id,
        email: userData[i].email,
        name: userData[i].name, 
        profileImage: userData[i].profileImage,  
        activeStatus: userData[i].activeStatus,
        userRole: userData[i].userRole,
        createdAt: userData[i].createdAt, 
      };
      data.push(data2);
    }

    res.status(200).json({
      userDataLength: data.length,
      userData: data,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const membserActiveStatus = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const userData = await StaffModel.findById({ _id: req.body.id });
    if (userData) {
      if (userData.activeStatus === false) {
        await StaffModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await StaffModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const userData1 = await StaffModel.findById({ _id: req.body.id });
    res.status(200).json({
      userData: userData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const membserRemove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    
    await StaffModel.findByIdAndDelete({ _id: req.body.id });
    await WishlistModel.find({userId:req.body.id});
    
    const userData1 = await StaffModel.find().sort({_id:-1});

    res.status(200).json({
      userData: userData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
