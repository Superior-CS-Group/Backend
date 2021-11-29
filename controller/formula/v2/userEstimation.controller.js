import UserEstimationModel from "../../../model/formula/v2/userEstimation.js";

export async function createUserEstimation(req, res) {
  try {
    const userEstimation = new UserEstimationModel(req.body);
    await userEstimation.save();
    return res
      .status(200)
      .json({ msg: "User Estimation Save successful", userEstimation });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      errors: error,
    });
  }
}

export async function updateUserEstimation(req, res) {
  try {
    const userEstimationId = req.params.estimationId;
    const userEstimation = await UserEstimationModel.findByIdAndUpdate(
      userEstimationId,
      {
        $set: { services: req.body.services },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Updated Successfully", data: userEstimation });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getUserEstimation(req, res) {
  try {
    const userId = req.user._id;
    const userEstimation = await UserEstimationModel.find({
      userId: userId,
    });
    return res.status(200).json({ data: userEstimation });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      errors: error,
    });
  }
}
