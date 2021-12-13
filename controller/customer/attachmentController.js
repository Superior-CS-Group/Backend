import StaffModel from "../../model/staff/staffModel.js";
import CustomerAttachmentModel from "../../model/customer/attachementModel.js";
import base64ToFile from "../../utils/base64ToFile.js";
import distance from "google-distance-matrix";

export const addAttachement = async (req, res) => {
  const userId = req.user._id;
  // console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }

  try {
    const data = {
      attachmentLable: req.body.attachmentLable,
      customerId: req.body.customerId,
      leadPerson: req.body.leadPerson,
    };

    const newAttachmentlist = new CustomerAttachmentModel(data);
    const attachment = [];
    for (let i in req.body.attachment) {
      const Attachment = req.body.attachment[i];

      const updatedAttachment = await base64ToFile(
        Attachment,
        currentUser._id,
        "attachment"
      );
      attachment.push(updatedAttachment);
    }

    newAttachmentlist.attachment = attachment;

    await newAttachmentlist.save();

    res.status(200).json({
      message: "Success",
      Data: newAttachmentlist,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const AttachementList = async (req, res) => {
  const userId = req.user._id;
  // console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }

  const attachmentData = await CustomerAttachmentModel.find(
    {
      customerId: req.body.customerId,
    },
    { attachmentLable: 1, attachment: 1 }
  ).sort({ _id: 1 });

  res.status(200).json({
    message: "Success",
    DataLength: attachmentData.length,
    Data: attachmentData,
  });
};

