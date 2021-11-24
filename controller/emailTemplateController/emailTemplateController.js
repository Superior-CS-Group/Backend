import StaffModel from "../../model/staff/staffModel.js";
import EmailTemplateModel from "../../model/emailTemplate/emailTemplateModel.js";

export const addEmail = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    // console.log(req.body);
    if (!req.body.name) {
      return res.status(400).json({ error: "Name is required" });
    }
    await EmailTemplateModel.create({
      name: req.body.name,
      headerPart: req.body.headerPart,
      subject: req.body.subject,
      bodyPart: req.body.bodyPart,
      footerPart: req.body.footerPart,
    });

    const Data = await EmailTemplateModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: Data.length,
      Data: Data,
    });
  } catch (errors) {
    // console.log(errors,"errors")
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const TemplateList = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    // console.log(req.body);
     

    const Data = await EmailTemplateModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: Data.length,
      Data: Data,
    });
  } catch (errors) {
    // console.log(errors,"errors")
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};
