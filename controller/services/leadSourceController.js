import LeadSourceModel from "../../model/admin/leadSourceModel.js";
import StaffModel from "../../model/admin/staffModel.js";

export const addLeadSource = async (req, res) => {
  // const userId = req.query.userId || req.user._id;
  console.log(req.body)
  // const currentUser = await LeadSourceModel.findById(userId);

  // if (!currentUser) {
  //   return res.status(401).json({ error: "User not found" });
  // }

  try {

    await LeadSourceModel.create({
      name: req.body.name,
    });
 

    res.status(200).json({
      message: "Success",
    });
  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const LeadSourceList = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const leadSourceData = await LeadSourceModel.find().sort({ _id: -1 });

    res.status(200).json({
      userDataLength: leadSourceData.length,
      userData: leadSourceData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const ChangeStatus = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await LeadSourceModel.findById({ _id: req.body.id });
    if (checkData) {
      if (checkData.activeStatus === false) {
        await LeadSourceModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await LeadSourceModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const checkData1 = await LeadSourceModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const LeadSourceRemove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await LeadSourceModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await LeadSourceModel.find().sort({ _id: -1 });

    res.status(200).json({
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
