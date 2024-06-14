const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("./userModel");
const mongoose = require("mongoose");


const registerUser = asyncHandler(async (req, res) => {
  const { firstName, email, password, lastName } = req.body;
  if (!firstName || !email || !password || !lastName) {
    res.status(400);
    throw new Error("Please add all fields");
  }


  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
   
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      userrole: user.userrole,
      token: generateToken(user._id),
     
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("hi",user.category)
    res.json({
      _id: user.id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      token: generateToken(user._id),
    
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});


const getMe = asyncHandler(async (req, res) => {
  console.log("0000");
  res.status(200).json(req.user);
});
const updateUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params; 
  const { newPassword } = req.body;

  try {
    
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
const updatePassword = asyncHandler(async (req, res) => {
  const { userId } = req.params; 
  const { currentPassword, newPassword } = req.body;

  try {

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


const updateDocument = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such User" });
  }

   const existingUser = await User.findOne({ email: email });
   if (existingUser && existingUser._id.toString() !== id) {
     return res.status(400).json({ error: "Email already exists for another user" });
   }
 
 
  const defaultTemModel = await User.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!defaultTemModel) {
    return res.status(400).json({ error: "No Such Workout" });
  }

  res.status(200).json(defaultTemModel);
};


const getChecklistByCategory = async (req, res) => {
  const { category } = req.params;


  const checklistCategory = categoryChecklists.find(
    (item) => item.category === category
  );

  if (!checklistCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.json(checklistCategory.checklists);
};


const generateToken = (id) => {
  return jwt.sign({ id }, "1231", {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserPassword,
  updatePassword,
  updateDocument,
  getChecklistByCategory
};
