import UserRoleModel from "../../model/userRole/userRoleModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import UnitModel from "../../model/unit/unitModel.js";
import StatusNameModel from "../../model/status/statusNameModel.js";

export const addStatus = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    await StatusNameModel.create({
      name: req.body.name,
    });

    const Data = await StatusNameModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: Data.length,
      Data: Data,
    });
  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const StatusList = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  //console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const statusListData = await StatusNameModel.find().sort({ _id: -1 });

    res.status(200).json({
      userDataLength: statusListData.length,
      userData: statusListData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Update = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await StatusNameModel.findById({ _id: req.body.id });
    if (checkData) {
      await StatusNameModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: { name: req.body.name, activeStatus: req.body.status },
        }
      );
    } else {
    }
    const checkData1 = await StatusNameModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Details = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await StatusNameModel.findById({ _id: req.body.id });
 

    res.status(200).json({ 
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Remove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await StatusNameModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await StatusNameModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: checkData.length,
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
