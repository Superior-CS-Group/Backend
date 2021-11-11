import UserRoleModel from "../../model/admin/userRoleModel.js";
import StaffModel from "../../model/admin/staffModel.js";

export const addUserRole = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    await UserRoleModel.create({
      name: req.body.name,
    });

    const Data = await UserRoleModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: Data.length,
      Data: Data,
    });

  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const UserRolePermisionList = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  //console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const leadSourceData = await UserRoleModel.find().sort({ _id: -1 });

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
    const checkData = await UserRoleModel.findById({ _id: req.body.id });
    if (checkData) {
      if (checkData.activeStatus === false) {
        await UserRoleModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await UserRoleModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const checkData1 = await UserRoleModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const UserRoleRemove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await UserRoleModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await UserRoleModel.find().sort({ _id: -1 });

    res.status(200).json({
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
