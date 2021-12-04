import CatalogModel from "../../../model/services/v2/catalogModel.js";
import VariationModelV2 from "../../../model/services/v2/variationModel.js";
import FormulaModelV2 from "../../../model/formula/v2/formula.model.js";
import {
  validateCreateCatalogInput,
  validateCreateServiceInput,
  validateCreateVariationInput,
} from "../../../validator/catalog/v2/catalog.js";
import base64ToFile from "../../../utils/base64ToFile.js";

export async function createCatalog(req, res) {
  try {
    console.log("req: ", req.user);
    const { isValid, errors } = validateCreateCatalogInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const isExists = await CatalogModel.findOne({ name: req.body.name });
    if (isExists) {
      return res.status(400).json({ errors: { name: "Already Exists" } });
    }
    const images = [];
    if (req.body.images && req.body.images.length > 0) {
      for (let i = 0; i < req.body.images.length; i++) {
        const imageUrl = await base64ToFile(
          req.body.images[i].split(",")[1],
          req.user.id,
          "materials"
        );
        images.push(imageUrl);
      }
    }

    req.body.images = images;

    const newCatalog = await CatalogModel.create(req.body);
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
      { _id: catalogId },
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

export const deleteCatelog = async (req, res) => {
  const catelogId = req.params.catalogId;

  try {
    const isCatalogUsed = await FormulaModelV2.findOne({ catalogs: catelogId });
    if (isCatalogUsed) {
      return res.status(400).json({
        errors: {
          msg: `${
            isCatalogUsed.type === "service" ? "Service" : "Catalog"
          } is used in formula, cannot be deleted`,
        },
      });
    }
    const catalog = await CatalogModel.findByIdAndDelete({ _id: catelogId });
    if (catalog.type === "subCatalog") {
      await VariationModelV2.deleteMany({ catelogId });
    }
    return res.status(200).json({ msg: "Catalog deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export async function getCatalogs(req, res) {
  try {
    const catalogId = req.query.catalogId || "";
    console.log("catalogId: ", catalogId);
    const filter = { $or: [{ type: "catalog" }, { type: "subCatalog" }] };
    if (catalogId && catalogId !== "undefined") {
      filter._id = catalogId;
    }
    const catalogs = await CatalogModel.find(filter);
    return res.status(200).json({
      data: catalogs,
    });
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
    const isExists = await VariationModelV2.findOne({
      name: req.body.name,
      catelogId: req.body.catelogId,
    });
    if (isExists) {
      return res.status(400).json({ errors: { name: "Already Exists" } });
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

export async function updateVariation(req, res) {
  try {
    const variationId = req.body._id;
    const { isValid, errors } = validateCreateVariationInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const updatedVariation = await VariationModelV2.findByIdAndUpdate(
      { _id: variationId },
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Variation updated successfully", data: updatedVariation });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export const deleteVariation = async (req, res) => {
  const variationId = req.params.variationId;
  try {
    await VariationModelV2.findByIdAndDelete({
      _id: variationId,
    });
    return res.status(200).json({ msg: "Variation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

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
    const type = req.query.searchFor;
    const catalogName = req.params.catalogName || "";
    let filter = {};
    if (!type || !["catalog", "service", "subCatalog"].includes(type)) {
      filter = {
        $or: [{ type: "catalog" }, { type: "service" }],
      };
    } else {
      filter = {
        type: type,
      };
    }
    const catalogs = await CatalogModel.find({
      name: { $regex: catalogName, $options: "i" },
      ...filter,
    });
    return res.status(200).json({ data: catalogs });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function createService(req, res) {
  try {
    const { isValid, errors } = validateCreateServiceInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const isExists = await CatalogModel.findOne({ name: req.body.name });
    if (isExists) {
      return res.status(400).json({ errors: { name: "Already Exists" } });
    }
    const newService = new CatalogModel(req.body);
    await newService.save();
    return res.status(200).json({ msg: "New Service is created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function updateService(req, res) {
  try {
    const serviceId = req.params.serviceId;
    const { isValid, errors } = validateCreateServiceInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const isExists = await CatalogModel.findOne({
      name: req.body.name,
      _id: { $ne: serviceId },
    });
    if (isExists) {
      return res.status(400).json({ errors: { name: "Already Exists" } });
    }
    const updatedService = await CatalogModel.findByIdAndUpdate(
      serviceId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Service updated successfully", data: updatedService });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export async function getServices(req, res) {
  try {
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 100;
    const services = await CatalogModel.find({ type: "service" })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return res.status(200).json({ data: services, pageNumber, pageSize });
  } catch (error) {
    console.log("errors: ", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", errors: error });
  }
}

export const deleteService = async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    await CatalogModel.findByIdAndDelete({
      _id: serviceId,
    });
    return res.status(200).json({ msg: "Service deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
