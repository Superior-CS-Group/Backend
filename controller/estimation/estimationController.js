import LeadSourceModel from "../../model/leadSource/leadSourceModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import EstimationModel from "../../model/estimation/estimationModel.js";
import { InvoiceNumber } from "invoice-number";

export const addLead = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    

    const getData = await EstimationModel.find().sort({ _id: -1 }).limit(1);

    const preInvoiceNumber = (getData[0].leadInvoinceNo);

    var newInvoiceNo = InvoiceNumber.next(`${preInvoiceNumber}`);
 

    const createLeadData = await EstimationModel.create({
      name: req.body.customerName,
      email: req.body.email,
      contactNo: req.body.contactNo,
      leadSource: req.body.leadSource,
      leadPerson: req.body.leadPerson,
      estimaitonDate: req.body.estimaitonDate,
      estimaitonSentDate: req.body.estimaitonSentDate,
      estimaitonStatus: req.body.estimaitonStatus,
      leadInvoinceNo:newInvoiceNo
    });

    res.status(200).json({
      message: "Success",
      Data:createLeadData
    });
  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const UpcomingEstimaitonLead = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {

    const leadData = await EstimationModel.find({leadPerson: { $in: [userId] }}).sort({ _id: -1 });

    res.status(200).json({
      DataLength: leadData.length,
      Data: leadData,
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

export const CustomerLeadRemove = async (req, res) => {
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
