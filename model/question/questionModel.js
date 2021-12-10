import Mongoose from "mongoose";

const QuestionSchema = new Mongoose.Schema(
  {
    
    questionLabel: {
      type: String,
      required: true
    },
    questionInputType: {
      type: String,
      default: true,
    },
    questionValue: {
      type: Array, 
    },
    questionParentId: {
      type: String,
      default: "",
    },
    questionParentValue: {
      type: String,
      default: "",
    },
    addedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const QuestionModel = Mongoose.model("Question", QuestionSchema);
export default QuestionModel;
