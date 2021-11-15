import UserModel from "../../model/customerModel.js";
import LeadSourceModel from "../../model/leadSource/leadSourceModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import CustomerLeadModel from "../../model/customer/customerLeadModel.js";
import EstimationModel from "../../model/estimation/estimationModel.js";
import { InvoiceNumber } from "invoice-number";

export const addLead = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    var preInvoiceNumber;

    const getData = await CustomerLeadModel.find().sort({ _id: -1 }).limit(1);
    if (getData.length > 0) {
      preInvoiceNumber = getData[0].leadInvoinceNo;
    } else {
      preInvoiceNumber = "C1000001";
    }

    var newInvoiceNo = InvoiceNumber.next(`${preInvoiceNumber}`);

    const customerLead = await CustomerLeadModel.create({
      name: req.body.customerName,
      email: req.body.email,
      contactNo: req.body.contactNo,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      postalCode: req.body.postalCode,
      address: req.body.address,
      leadInvoinceNo: newInvoiceNo,
    });

    // const createLeadData = await EstimationModel.create({
    //   name: req.body.customerName,
    //   email: req.body.email,
    //   contactNo: req.body.contactNo,
    //   leadSource: req.body.leadSource,
    //   leadPerson: req.body.leadPerson,
    //   estimaitonDate: req.body.estimaitonDate,
    //   estimaitonSentDate: req.body.estimaitonSentDate,
    //   estimaitonStatus: req.body.estimaitonStatus,
    //   leadInvoinceNo: newInvoiceNo,
    //   customerLeadId: customerLead._id,
    // });

    res.status(200).json({
      message: "Success",
      Data: customerLead,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const assignCustomerLead = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    var preInvoiceNumber;

    const getCustomerData = await CustomerLeadModel.findById({
      _id: req.body.customerId,
    });

    const getData = await EstimationModel.find().sort({ _id: -1 }).limit(1);
    if (getData.length > 0) {
      preInvoiceNumber = getData[0].leadInvoinceNo;
    } else {
      preInvoiceNumber = "E1000001";
    }

    var newInvoiceNo = InvoiceNumber.next(`${preInvoiceNumber}`);

    const createLeadData = await EstimationModel.create({
      name: getCustomerData.customerName,
      email: getCustomerData.email,
      contactNo: getCustomerData.contactNo,
      leadSource: getCustomerData.leadSource,
      leadPerson: req.body.salsePersonId,
      leadInvoinceNo: newInvoiceNo,
      customerLeadId: getCustomerData._id,
    });

    res.status(200).json({
      message: "Success",
      Data: createLeadData,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};


export const updateCustomerInfo = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await CustomerLeadModel.findById({ _id: req.body.id });
    if (checkData) {
      
        await CustomerLeadModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set:  req.body,
          }
        );
       
    } else {
    }
    const checkData1 = await CustomerLeadModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const UpcomingEstimaitonLead = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const leadData = await EstimationModel.find({
      leadPerson: { $in: [userId] },
    }).sort({ _id: -1 });

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

export const membserList = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const userData = await UserModel.find({ userRole: "user" }).sort({
      _id: -1,
    });

    for (var i in userData) {
      let data2 = {
        _id: userData[i]._id,
        email: userData[i].email,
        firstName: userData[i].firstName,
        lastName: userData[i].lastName,
        isEmailVerified: userData[i].isEmailVerified,
        profileImage: userData[i].profileImage,
        allPurchase: userData[i].allPurchase,
        followedWishlist: userData[i].followedWishlist,
        featureAnnoucement: userData[i].featureAnnoucement,
        puttingYourFirst: userData[i].puttingYourFirst,
        activeStatus: userData[i].activeStatus,
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
  console.log(userId);
  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const userData = await UserModel.findById({ _id: req.body.id });
    if (userData) {
      if (userData.activeStatus === false) {
        await UserModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await UserModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const userData1 = await UserModel.findById({ _id: req.body.id });
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
  console.log(userId);
  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await UserModel.findByIdAndDelete({ _id: req.body.id });
    await WishlistModel.find({ userId: req.body.id });

    const userData1 = await UserModel.find().sort({ _id: -1 });

    res.status(200).json({
      userData: userData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
