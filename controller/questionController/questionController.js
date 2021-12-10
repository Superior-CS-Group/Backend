import StaffModel from "../../model/staff/staffModel.js";
import QuestionModel from "../../model/question/questionModel.js";

export const addQuestion = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    if (!req.body.questionLabel) {
      return res.status(400).json({ error: "Lablel is required" });
    }
    await QuestionModel.create(req.body);

    const Data = await QuestionModel.find().sort({ _id: 1 });

    res.status(200).json({
      DataLength: Data.length,
      Data: Data,
    });
  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const QuestionList = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  //console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const questionData = await QuestionModel.find().sort({ _id: 1 });
    let allData = [];

    for (let i = 0; questionData.length > i; ) {
      const questionCheck = await QuestionModel.find({
        questionParentId: questionData[i]._id,
      }).sort();
      let checkData = [];
      for (let j = 0; questionCheck.length > j; ) {
        if (
          questionData[i].questionValue.includes(
            questionCheck[j].questionParentValue
          )
        ) {
          checkData.push({
            _id: questionCheck[j]._id,
            lable: questionCheck[j].questionLabel,
            inputType: questionCheck[j].questionInputType,
            questionValue: questionCheck[j].questionParentValue,
          });
        } else {
          checkData.push({
            _id: questionCheck[j]._id,
            lable: questionCheck[j].questionLabel,
            inputType: questionCheck[j].questionInputType,
            questionValue: questionCheck[j].questionParentValue,
          });
        }

        j++;
      }
      allData.push({
        _id: questionData[i]._id,
        lable: questionData[i].questionLabel,
        inputType: questionData[i].questionInputType,
        questionValue: questionData[i].questionValue,
        relatedQue: checkData,
      });

      i++;
    }
    // console.log("allData",allData)

    res.status(200).json({
      DataLength: allData.length,
      Data: allData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const NextQuestion = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  //console.log(userId)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const questionData = await QuestionModel.find({
      questionParentId: req.body.id,
      questionParentValue: req.body.value,
    }).sort({ _id: 1 }); 

    res.status(200).json({
      DataLength: questionData.length,
      Data: questionData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Update = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await QuestionModel.findById({ _id: req.body.id });
    if (checkData) {
      await QuestionModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: req.body,
        }
      );
    } else {
    }
    const checkData1 = await QuestionModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Remove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await QuestionModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await QuestionModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: checkData.length,
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Details = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await QuestionModel.find({ _id: req.body.id });

    res.status(200).json({
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
