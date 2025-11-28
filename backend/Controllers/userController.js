const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../config/generateToken');

//register
const registerUser = async (req, res) => {
  try{
      console.log("req.body",req.body)
  const { username, email, password } = req.body;

  
  const Isuser = await User.findOne({ email });
  if (Isuser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(201).json({ _id: user._id, username: user.username, email: user.email, token ,message:"Registered"});
  }catch(error){
    console.log(error);
     res.status(500).json({ message: error.message || 'Something went wrong' });
  }
  
};


//login

const loginUser = async (req, res) => {

  console.log(req.body);
  const { email, password } = req.body;

  
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1d'});

  res.status(200).json({_id: user._id,username: user.username,email: user.email,profilePic: user.profilePic,token,});
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};


const updateUserProfile = async (req, res) => {
  try {
  console.log("Uploadimage", req.body);
  console.log("REQ.USER", req.user);

  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.profilePic = req.body.profilePic || user.profilePic;

    console.log("Saving user...");

    const updatedUser = await user.save(); 

    console.log("User saved!", updatedUser);

    const token = generateToken(updatedUser._id); 
    console.log("Token generated", token);

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      token,
    });

  } else {
    res.status(404).json({ message: 'User not found' });
  }
} catch (error) {
  console.error("UPDATE ERROR", error); 
  res.status(500).json({ message: error.message || 'Something went wrong' });
}

};




module.exports = { registerUser, loginUser ,updateUserProfile,getUserProfile};