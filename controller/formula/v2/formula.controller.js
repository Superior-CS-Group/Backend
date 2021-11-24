import FormulaModelV2 from "../../../model/formula/v2/formula.model.js";

import validateAddNewFormulaInput from "../../../validator/formula/v2/addNewFormula.validator.js";

/**
 * @author digimonk technologies
 * @developer - Saral Shrivastava
 * @version - 2.0.0
 */
export async function addNewFormulaHandler(req, res) {
  try {
    const { errors, isValid } = validateAddNewFormulaInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: errors });
    }
    const formula = new FormulaModelV2(req.body);
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

export async function updateFormulaByIdHandler(req, res) {
  try {
    const { errors, isValid } = validateAddNewFormulaInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: errors });
    }
    const formulaId = req.params.formulaId || "";
    const formula = await FormulaModelV2.findByIdAndUpdate(
      formulaId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json({
      data: formula,
      message: "Formula updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}

export async function getFormulaByIdHandler(req, res) {
  try {
    const formulaId = req.params.formulaId || "";
    const formula = await FormulaModelV2.findById(formulaId);
    return res.status(200).json({ data: formula });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}

export async function getAllFormulaHandler(req, res) {
  try {
    const formulas = await FormulaModelV2.find();
    return res.status(200).json({ data: formulas });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}
