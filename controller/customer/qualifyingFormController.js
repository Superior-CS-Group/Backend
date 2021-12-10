import StaffModel from "../../model/staff/staffModel.js";
import QualifyingFormModel from "../../model/customer/qualifyingFormModel.js";

export const addQualifyingForm = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ errors: "User not found" });
  }

  try {
    const QualifyingForm = await QualifyingFormModel.create(req.body);

    res.status(200).json({
      message: "Success",
      Data: QualifyingForm,
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};
