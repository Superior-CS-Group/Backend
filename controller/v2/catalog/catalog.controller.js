import CatalogModel from "../../../model/services/v2/catalogModel.js";
import VariationModelV2 from "../../../model/services/v2/variationModel.js";
import {
  validateCreateCatalogInput,
  validateCreateServiceInput,
  validateCreateVariationInput,
} from "../../../validator/catalog/v2/catalog.js";
import base64ToFile from "../../../utils/base64ToFile.js";
import StaffModel from "../../../model/staff/staffModel.js";

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
    // const catalogId = req.params.catalogId;
    console.log(req.body)
    const { isValid, errors } = validateCreateCatalogInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const isExists = await CatalogModel.findOne({ name: req.body.name });
    if (isExists) {
      return res.status(400).json({ errors: { name: "Already Exists" } });
    }
    const updatedCatalog = await CatalogModel.findByIdAndUpdate(
      {_id:req.body.catelogId},
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

export const RemoveCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {

    await VariationModelV2.deleteMany({ catelogId:req.body.id });
    await CatalogModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await CatalogModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: checkData.length,
      data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export async function getCatalogs(req, res) {
  try {
    const catalogs = await CatalogModel.find({
      $or: [{ type: "catalog" }, { type: "subCatalog" }],
    });
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
    // const variationId = req.params.variationId;
    const { isValid, errors } = validateCreateCatalogInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const updatedVariation = await VariationModelV2.findByIdAndUpdate(
      {_id:req.body.id},
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

export const RemoveVariation = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await VariationModelV2.findByIdAndDelete({ _id: req.body.id });

    const checkData = await VariationModelV2.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: checkData.length,
      data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export async function getVariationsData(req, res) {
  try {
    const variationId = req.query.variationId;
    
    const variations = await VariationModelV2.findById({ _id:req.body.id });
    console.log("valriations: ", variations);
    return res.status(200).json({ data: variations });
  } catch (error) {
    console.log("error: ", error);
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
    if (!type || !["catalog", "service", "variation"].includes(type)) {
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
    const isExists = await CatalogModel.findOne({ name: req.body.name });
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


export const removeService = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await CatalogModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await CatalogModel.find().sort({ _id: -1 });

    res.status(200).json({
      DataLength: checkData.length,
      data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};