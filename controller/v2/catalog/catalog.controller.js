import CatalogModel from "../../../model/services/v2/catalogModel.js";
import VariationModelV2 from "../../../model/services/v2/variationModel.js";
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
    const type = req.query.searchFor;
    const catalogName = req.params.catalogName || "";
    let filter = {};
    if (!type) {
      filter = {
        type: {
          $or: ["catalog", "service"],
        },
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
    const pageSize = req.query.pageSize || 10;
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
