import CatalogModel from "../../../model/services/v2/catalogModel.js";
import VariationModel from "../../../model/services/variationModel.js";
import {
  validateCreateCatalogInput,
  validateCreateVariationInput,
} from "../../../validator/catalog/v2/catalog.js";

export async function createCatalog(req, res) {
  try {
    const { isValid, errors } = validateCreateCatalogInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newCatalog = new CatalogModel(req.body);
    return res
      .status(200)
      .json({ msg: "New Catalog created successfully", data: newCatalog });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error", errors: err });
  }
}

export async function updateCatalog(req, res) {
  try {
    const catalogId = req.params.catalogId;
    const { isValid, errors } = validateCreateCatalogInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const updatedCatalog = await CatalogModel.findByIdAndUpdate(
      catalogId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Catalog updated successfully", data: updatedCatalog });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function getCatalogs(req, res) {
  try {
    const catalogs = await CatalogModel.find();
    return res.status(200).json({ data: catalogs });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function createVariation(req, res) {
  try {
    const { isValid, errors } = validateCreateVariationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newVariation = new CatalogModel(req.body);
    await CatalogModel.findByIdAndUpdate(req.body.materialId, {
      $push: {
        variations: newVariation._id,
      },
    });
    return res
      .status(200)
      .json({ msg: "New Variation created successfully", data: newVariation });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function getVariationsByCatalog(req, res) {
  try {
    const catalogId = req.params.catalogId;
    const variations = VariationModel.find({ catalogId });
    return res.status(200).json({ data: variations });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}
