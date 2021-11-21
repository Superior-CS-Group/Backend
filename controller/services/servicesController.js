import LeadSourceModel from "../../model/leadSource/leadSourceModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import ServicesModel from "../../model/services/servicesModel.js";
import VariationModel from "../../model/services/variationModel.js";
import base64ToFile from "../../utils/base64ToFile.js";

export const addServiceCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const ServieData = req.body;

    const createServieData = new ServicesModel(ServieData);
    await createServieData.save();

    let createVariatioData = [];
    if (req.body.variation) {
      for (let i in req.body.variation) {
        const updatedVariation = req.body.variation[i];
        let variationImage;
        if (updatedVariation.image) {
          variationImage = await base64ToFile(
            updatedVariation.image,
            currentUser._id,
            "variation"
          );
        }

        const variationData = {
          title: updatedVariation.name,
          price: updatedVariation.price,
          unit: updatedVariation.unit,
          image: variationImage,
          catelogId: createServieData._id,
        };

        createVariatioData = new VariationModel(variationData);
        await createVariatioData.save();
      }
    }

    res.status(200).json({
      message: "Success",
      Data: createServieData,
      VariationData: createVariatioData,
    });
  } catch (errors) {
    console.log(errors, "errors");
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const ListServiceCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const checkData = await ServicesModel.find().sort({ _id: -1 });
    var servicesData = [];

    for (let i in checkData) {
      const updatedVariation = checkData[i];
      const checkVariationData = await VariationModel.find({
        catelogId: updatedVariation._id,
      }).sort({ _id: -1 });

      const Data = {
        _id: updatedVariation._id,
        type: updatedVariation.type,
        title: updatedVariation.name,
        hours: updatedVariation.hours,
        days: updatedVariation.days,
        price: updatedVariation.rate,
        unit: updatedVariation.unit,
        VariationDataLenth: checkVariationData.length,
        VariationData: checkVariationData,
      };

      servicesData.push(Data);
    }

    res.status(200).json({
      message: "List",
      DataLenth: servicesData.length,
      Data: servicesData,
    });
  } catch (errors) {
    console.log(errors, "errors");
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const VariationListServiceCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const checkVariationData = await VariationModel.find()
      .sort({ _id: -1 })
      .populate("catelogId");

    res.status(200).json({
      message: "List",
      DataLenth: checkVariationData.length,
      Data: checkVariationData,
    });
  } catch (errors) {
    console.log(errors, "errors");
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const ListServiceCatelogByType = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const checkData = await ServicesModel.find({ type: req.body.type }).sort({
      _id: -1,
    });
    var servicesData = [];

    for (let i in checkData) {
      const updatedVariation = checkData[i];
      const checkVariationData = await VariationModel.find({
        catelogId: updatedVariation._id,
      }).sort({ _id: -1 });

      const Data = {
        _id: updatedVariation._id,
        type: updatedVariation.type,
        title: updatedVariation.name,
        hours: updatedVariation.hours,
        days: updatedVariation.days,
        price: updatedVariation.rate,
        unit: updatedVariation.unit,
        VariationDataLenth: checkVariationData.length,
        VariationData: checkVariationData,
      };

      servicesData.push(Data);
    }

    res.status(200).json({
      message: "List",
      DataLenth: servicesData.length,
      Data: servicesData,
    });
  } catch (errors) {
    console.log(errors, "errors");
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const DetailServiceCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;

  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  console.log(req.body);
  try {
    const checkData = await ServicesModel.findById({ _id: req.body._id });
    var servicesData = [];

    const checkVariationData = await VariationModel.find({
      catelogId: req.body._id,
    }).sort({ _id: -1 });

    const Data = {
      _id: checkData._id,
      title: checkData.name,
      hours: checkData.hours,
      days: checkData.days,
      price: checkData.rate,
      unit: checkData.unit,
      VariationData: checkVariationData,
    };

    servicesData.push(Data);

    res.status(200).json({
      message: "Detail",
      Data: servicesData,
    });
  } catch (errors) {
    console.log(errors, "errors");
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const updateServiceCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const ServieData = {
      name: req.body.name,
      hours: req.body.hours,
      days: req.body.days,
      rate: req.body.rate,
      unit: req.body.unit,
      type: req.body.type,
    };
    const updateData = await ServicesModel.findByIdAndUpdate(
      { _id: req.body._id },
      ServieData,
      { new: true }
    );

    for (let i in req.body.variation) {
      const updatedVariation = req.body.variation[i];
      const variationImage = await base64ToFile(
        updatedVariation.image,
        currentUser._id,
        "variation"
      );

      const variationData = {
        title: updatedVariation.name,
        price: updatedVariation.price,
        unit: updatedVariation.unit,
        image: variationImage,
        catelogId: req.body._id,
      };

      const createVariatioData = await VariationModel.findByIdAndUpdate(
        { _id: updatedVariation._id },
        variationData
      );
    }

    res.status(200).json({
      message: "Success",
      Data: updateData,
    });
  } catch (errors) {
    console.log(errors, "errors");
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const ChangeStatus = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await LeadSourceModel.findById({ _id: req.body.id });
    if (checkData) {
      if (checkData.activeStatus === false) {
        await LeadSourceModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await LeadSourceModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const checkData1 = await LeadSourceModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const RemoveServiceCatelog = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await VariationModel.deleteMany({ catelogId: req.body._id });
    await ServicesModel.findByIdAndDelete({ _id: req.body._id });

    const checkData = await ServicesModel.find().sort({ _id: -1 });

    var servicesData = [];

    for (let i in checkData) {
      const updatedVariation = checkData[i];
      const checkVariationData = await VariationModel.find({
        catelogId: updatedVariation._id,
      }).sort({ _id: -1 });

      const Data = {
        _id: updatedVariation._id,
        title: updatedVariation.name,
        hours: updatedVariation.hours,
        days: updatedVariation.days,
        price: updatedVariation.rate,
        unit: updatedVariation.unit,
        VariationDataLenth: checkVariationData.length,
        VariationData: checkVariationData,
      };

      servicesData.push(Data);
    }

    res.status(200).json({
      message: "Removed Success",
      DataLenth: servicesData.length,
      Data: servicesData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const RemoveServiceCatelogVariation = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await VariationModel.findByIdAndDelete({ _id: req.body.variation_id });
    const checkData = await ServicesModel.find({ _id: req.body.catelog_id });

    var servicesData = [];

    for (let i in checkData) {
      const updatedVariation = checkData[i];
      const checkVariationData = await VariationModel.find({
        catelogId: updatedVariation._id,
      }).sort({ _id: -1 });

      const Data = {
        _id: updatedVariation._id,
        title: updatedVariation.name,
        hours: updatedVariation.hours,
        days: updatedVariation.days,
        price: updatedVariation.rate,
        unit: updatedVariation.unit,
        VariationDataLenth: checkVariationData.length,
        VariationData: checkVariationData,
      };

      servicesData.push(Data);
    }

    res.status(200).json({
      message: "Removed Success",
      DataLenth: servicesData.length,
      Data: servicesData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * @author digimonk Technologies
 * @developer Saral Shrivastava
 * @description This function is used to get services by there name
 * @param {object} req req object
 * @param {object} res res object
 * @param {string} req.query.catelogName name of the catalog we are searching
 * @returns
 */
export const searchCatelogByName = async (req, res) => {
  const catelogName = req.query.catelogName || "";
  try {
    const checkData = await ServicesModel.find({
      name: { $regex: catelogName, $options: "i" },
      type: "material",
    });
    res.status(200).json({
      DataLenth: checkData.length,
      Data: checkData,
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({ msg: "Internal Server error" });
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {string} req.query.catelogId id of the catalog for which we are searching variaitons
 * @returns
 */
export const getVariationByCatelogId = async (req, res) => {
  const catelogId = req.params.catelogId || "";
  if (!catelogId) {
    return res.status(400).json({ msg: "Bad Request" });
  }
  try {
    const variationList = await VariationModel.find({ catelogId });
    res
      .status(200)
      .json({ Data: variationList, DataLength: variationList.length });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server error" });
  }
};
