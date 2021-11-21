import StaffModel from "../../model/staff/staffModel.js";
import UnitModel from "../../model/unit/unitModel.js";

export const addUnit = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Name is required" });
    }
    await UnitModel.create({
      name: req.body.name,
    });

    const Data = await UnitModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: Data.length,
      Data: Data,
    });
  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const UnitList = async (req, res) => {

  const userId = req.query.userId || req.user._id;
  //console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const unitData = await UnitModel.find().sort({ _id: -1 });

    res.status(200).json({
      userDataLength: unitData.length,
      userData: unitData,
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
    const checkData = await UnitModel.findById({ _id: req.body.id });
    if (checkData) {
      await UnitModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: { name: req.body.name, activeStatus: req.body.status },
        }
      );
    } else {
    }
    const checkData1 = await UnitModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
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
    await UnitModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await UnitModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: checkData.length,
      Data: checkData,
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
    const checkData = await UnitModel.find({ _id: req.body.id });

    res.status(200).json({
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
