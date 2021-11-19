import mongoose from "mongoose";
import FormulaModel from "../../model/formula/formulaModel.js";

//validators
import validateAddNewFormulaInput from "../../validator/formula/addNewFormula.validator.js";

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 */
export async function addNewFormulaHandler(req, res) {
  /**
   * @description - handler for add new formula to store in db
   * @param {object} req - request object
   * @requires {
   *      title: string,
   *      customId: string,
   *      formula: string,
   *      formulaToShow: string,
   *      children: array,
   * }
   */
  try {
    const { errors, isValid } = validateAddNewFormulaInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: errors });
    }
    const formula = new FormulaModel(req.body);
    const savedFormula = await formula.save();
    return res.status(200).json({
      data: savedFormula,
      message: "Formula added successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 */
export async function getFormulaByIdHandler(req, res) {
  /**
   * @description - handler for get formula by id
   * @param {object} req - request object
   * @requires {
   *      id: string,
   * }
   */
  try {
    const { id } = req.params;
    const formula = await FormulaModel.findById(id);

    if (!formula) {
      return res.status(404).json({ errors: "Formula not found" });
    }
    return res.status(200).json({
      data: formula,
      message: "Formula found successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}
