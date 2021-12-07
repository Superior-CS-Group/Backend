import UserModel from "../../model/customerModel.js";
import LeadSourceModel from "../../model/leadSource/leadSourceModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import CustomerLeadModel from "../../model/customer/customerLeadModel.js";
import EstimationModel from "../../model/estimation/estimationModel.js";
import { InvoiceNumber } from "invoice-number";
import TabFilterModel from "../../model/tabFilter.js";

export const addTab = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }

  try {
    let TabData = req.body;
    TabData["userId"] = userId;
    let Tab = await TabFilterModel.create(req.body);

    res.status(200).json({
      message: "Success",
      Data: Tab,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const listTab = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }
  console.log(req);
  try {
    let Tab = await TabFilterModel.find({ userId });

    res.status(200).json({
      message: "Success",
      Data: Tab,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const removeTab = async (req, res) => {
  //   const userId = req.query.userId || req.user._id;
  //   console.log(req.body);
  //   const currentUser = await StaffModel.findById(userId);

  //   if (!currentUser) {
  //     return res.status(401).json({ errors: "User not found" });
  //   }

  try {
    let Tab = await TabFilterModel.findByIdAndDelete({ _id: req.body.id });
    res.status(200).json({
      message: "Success",
      Data: Tab,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const updateTab = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.params);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }

  try {
    let TabData = req.body;
    // TabData["userId"] = userId;

    await TabFilterModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: { filterObject: TabData },
      }
    );
    let Tab = await TabFilterModel.findById({ _id: req.params.id });
    res.status(200).json({
      message: "Success",
      Data: Tab,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};
