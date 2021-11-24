import FormulaModel from "../../../model/formula/v1/formulaModel.js";
import { updateFormulaRequestService } from "../../../services/formula.services.js";

//validators
import validateAddNewFormulaInput from "../../../validator/formula/v1/addNewFormula.validator.js";

/**
 * @author digimonk technologies
 * @developer Saral Shrivastava
 * @version 1.0.0
 * @description handler for add new formula to store in db
 * @param {object} req request object
 * @param {string} req.body.title title of formula
 * @param {string} req.body.customId custom id of formula used by other formula expressions
 * @param {string} req.body.formula formula used to evaluate the value
 * @param {string} req.body.formulaToShow formula used to show in frontend
 * @param {string} req.body.chilsdren children of formula
 */
export async function addNewFormulaHandler(req, res) {
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
 * @author digimonk technologies
 * @developer Saral Shrivastava
 * @version  1.0.0
 * @description handler for get formula by id
 * @param {object} req request object
 * @param {string} req.body.id id of formula
 */
export async function getFormulaByIdHandler(req, res) {
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

/**
 * @author - digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 1.0.0
 * @description - handler for update formula
 * @param {object} req request object
 * @param {string} req.params.id id of formula
 * @param {string?} req.body.title title of formula
 * @param {string?} req.body.formula - formula used to evaluate the value of expression
 * @param {string?} req.body.formulaToShow - formula used to show on frontend
 * @param {string[]?} req.body.children - children of the formula
 */
export async function updateFormulaByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const updateDetails = updateFormulaRequestService(req.body);
    const newFormula = await FormulaModel.findByIdAndUpdate(id, {
      $set: { ...updateDetails },
    });
    if (!newFormula) {
      return res.status(404).json({ errors: "Formula not Found" });
    }
    return res
      .status(200)
      .json({ data: newFormula, message: "Formula updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}
