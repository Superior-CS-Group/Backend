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

export const FindGoogleAddress = async (req, res) => {
  const userId = req.user._id;
  // console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }

  var origins = [req.body.origins];
  var destinations = [req.body.destinations];
  distance.key("AIzaSyBC9O1b8JhFyUiE2kAU-ULbcio2siKePYU");
  // distance.units("imperial");
  distance.mode("driving");

  distance.matrix(
    origins,
    destinations,
    function (err, distances, distanceAddress) {
      if (err) {
        return console.log(err);
      }
      if (!distances) {
        return console.log("no distances");
      }
      if (distances.status == "OK") {
        for (var i = 0; i < origins.length; i++) {
          for (var j = 0; j < destinations.length; j++) {
            var origin = distances.origin_addresses[i];
            var destination = distances.destination_addresses[j];
            if (distances.rows[0].elements[j].status == "OK") {
              var distance = distances.rows[i].elements[j].distance.text;
              var duration = distances.rows[i].elements[j].duration.text;
              distanceAddress =
                "Distance from " +
                origin +
                " to " +
                destination +
                " is " +
                distance +
                " and time " +
                duration;

              return res.status(200).json({
                message: "Success",
                Address: distanceAddress,
              });
            } else {
              distanceAddress =
                destination + " is not reachable by land from " + origin;

              return res.status(200).json({
                message: "Success",
                Address: distanceAddress,
              });
            }
          }
        }
      }
    }
  );
};
