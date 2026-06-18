const jwt = require("jsonwebtoken");const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// SIGN UP
router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });

    if(existingUser){
      return res.status(400).json({
        error:"Email already registered"
      });
    }


    const hashedPassword = await bcrypt.hash(password,10);


    const user = new User({
      name,
      email,
      password: hashedPassword
    });


    await user.save();


    res.json({
      message:"User created successfully"
    });


  } catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});





// LOGIN
router.post("/login", async (req,res)=>{

  try {

    const {email,password}=req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        error:"User not found"
      });
    }


    const match = await bcrypt.compare(password,user.password);


    if(!match){
      return res.status(400).json({
        error:"Wrong password"
      });
    }


    const token = jwt.sign(
      {
        id:user._id,
        email:user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn:"1h"
      }
    );


    res.json({
      message:"Login successful",
      name:user.name,
      token:token
    });


  } catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});





// FORGOT PASSWORD
router.post("/forgot-password",async(req,res)=>{


try{


const {email,password}=req.body;


const user = await User.findOne({email});


if(!user){

return res.status(404).json({

error:"User not found"

});

}



user.password = await bcrypt.hash(password,10);


await user.save();



res.json({

message:"Password updated successfully"

});



}catch(error){


res.status(500).json({

error:error.message

});


}


});




module.exports = router;