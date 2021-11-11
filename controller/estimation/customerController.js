import UserModel from "../../model/customerModel.js"; 

export const membserList = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const userData = await UserModel.find({userRole:"user"}).sort({ _id: -1 });

    for (var i in userData) { 
      let data2 = {
        _id: userData[i]._id,
        email: userData[i].email,
        firstName: userData[i].firstName,
        lastName: userData[i].lastName,
        isEmailVerified: userData[i].isEmailVerified,
        profileImage: userData[i].profileImage,
        allPurchase: userData[i].allPurchase,
        followedWishlist: userData[i].followedWishlist,
        featureAnnoucement: userData[i].featureAnnoucement,
        puttingYourFirst: userData[i].puttingYourFirst,
        activeStatus: userData[i].activeStatus,
        createdAt: userData[i].createdAt, 
      };
      data.push(data2);
    }

    res.status(200).json({
      userDataLength: data.length,
      userData: data,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const membserActiveStatus = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const userData = await UserModel.findById({ _id: req.body.id });
    if (userData) {
      if (userData.activeStatus === false) {
        await UserModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await UserModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const userData1 = await UserModel.findById({ _id: req.body.id });
    res.status(200).json({
      userData: userData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const membserRemove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId)
  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    
    await UserModel.findByIdAndDelete({ _id: req.body.id });
    await WishlistModel.find({userId:req.body.id});
    
    const userData1 = await UserModel.find().sort({_id:-1});

    res.status(200).json({
      userData: userData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
