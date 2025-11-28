const User = require('../models/userModel'); 
const bcrypt=require('bcryptjs')
const generateToken=require('../config/generateToken')
const admindetails = {
  email: 'admin@gmail.com',
  password: 'admin'
};

const adminLogin=async(req,res)=>{
    try{
 console.log(req.body);
    const {email,password}=req.body;
    if(email===admindetails.email && password===admindetails.password){

      const jwtid='admin123';
      const token=generateToken(jwtid);
      res.status(200).json({
        message: "Login successfully",token, admin: {_id: jwtid,email: admindetails.email, }, });
    }else{
        res.status(401).json({message:"check you credentials"});
    }
    }catch(error){
        res.status(500).json({message:"something fishy"});
    }
   
}

const getAllUsers=async(req,res)=>{
    try {
      const search=req.query.search || '';
      console.log(search);
      const regex=new RegExp(search,'i');

        const users=await User.find(
         {  $or: [
    { username: { $regex: regex } },
    { email: { $regex: regex } }
  ]}
        );
        res.json(users)
        
    } catch (error) {
        res.status(500).json({error:"server problem"});
        
    }
}

const deleteUser=async(req,res)=>{

    try {
         console.log(req.params);
    await User.findByIdAndDelete(req.params.id);
    res.josn({message:"user Deleted succesfuly"});
        
    } catch (error) {

    res.status(500).json({ error: 'Failed to delete user' });
        
    }
   
}



const addUser = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;


    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

   const hashedPassword = await bcrypt.hash(password, 10);
   
    const newUser = await User.create({
      username,
      email,
      password:hashedPassword,
      profilePic,
    });

    res.status(201).json({_id: newUser._id,username: newUser.username,email: newUser.email,profilePic: newUser.profilePic,});
  } catch (error) {
    console.error("AddUser Admin Error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const editUser = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;
console.log(req.body);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = await bcrypt.hash(password, 10);
    user.profilePic = profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports={
    adminLogin,
    getAllUsers,
    deleteUser,
    addUser,
    getUser,
    editUser
    
}