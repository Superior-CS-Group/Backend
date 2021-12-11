import FormulaModelV2 from "../../../model/formula/v2/formula.model.js";

import validateAddNewFormulaInput from "../../../validator/formula/v2/addNewFormula.validator.js";

import base64ToFile from "../../../utils/base64ToFile.js";

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
    const isExist = await FormulaModelV2.findOne({ title: req.body.title });
    if (isExist) {
      return res
        .status(400)
        .json({ errors: { title: "Formula already exist" } });
    }
    if (req.body.photo && req.body.photo.includes(",")) {
      req.body.photo = await base64ToFile(
        req.body.photo.split(",")[1],
        req.user.id,
        "serviceTemplate"
      );
    }

    const formula = new FormulaModelV2({
      ...req.body,
    });
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
    if (req.body.photo && req.body.photo.includes(",")) {
      req.body.photo = await base64ToFile(
        req.body.photo.split(",")[1],
        req.user.id,
        "serviceTemplate"
      );
    }
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

export async function searchFormulaByName(req, res) {
  try {
    const { searchTerm } = req.params;
    const formulas = await FormulaModelV2.find({
      title: { $regex: new RegExp(searchTerm), $options: "i" },
    })
      .populate("materials.formula")
      .populate("elements.formula")
      .populate("catalogs")
      .populate("materials.unit");
    return res.status(200).json({ data: formulas });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: error, msg: "Internal Server Error" });
  }
}

export async function deleteFormulaByIdHandler(req, res) {
  try {
    const formulaId = req.params.formulaId || "";
    const formula = await FormulaModelV2.findByIdAndDelete(formulaId);
    return res.status(200).json({ data: formula });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: error, msg: "internal Server Error" });
  }
}
