import CatalogModel from "../../../model/services/v2/catalogModel.js";
import VariationModelV2 from "../../../model/services/v2/variationModel.js";
import {
  validateCreateCatalogInput,
  validateCreateVariationInput,
} from "../../../validator/catalog/v2/catalog.js";

export async function createCatalog(req, res) {
  try {
    const { isValid, errors } = validateCreateCatalogInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const newCatalog = await CatalogModel.create(req.body);
    console.log("newCatalogBOdy: ", newCatalog);
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
    const newVariation = new VariationModelV2(req.body);
    await newVariation.save();
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
    const catelogId = req.query.catalogId;
    if (!catelogId) {
      return res
        .status(404)
        .json({ errors: { catalogId: "Catalog Id is required" } });
    }
    console.log("catelogId: ", catelogId);
    const variations = await VariationModelV2.find({ catelogId });
    console.log("valriations: ", variations);
    return res.status(200).json({ data: variations });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function searchCatalogByName(req, res) {
  try {
    const type = req.query.searchFor || "a";
    const catalogName = req.params.catalogName || "";
    const catalogs = await CatalogModel.find({
      name: { $regex: catalogName, $options: "i" },
      type: type,
    });
    return res.status(200).json({ data: catalogs });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}
