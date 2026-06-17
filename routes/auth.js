const express = require("express");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");

const router = express.Router();


// Replace with your Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


// SIGN UP
router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });


    if (existingUser) {

      return res.status(400).json({
        error: "Email already registered"
      });

    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({

      name: name,
      email: email,
      password: hashedPassword

    });


    await user.save();


    res.json({
      message: "User created successfully"
    });


  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

});




// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;


    const user = await User.findOne({ email });


    if (!user) {

      return res.status(400).json({
        error: "User not found"
      });

    }


    if (!user.password) {

      return res.status(400).json({

        error:
        "This account uses Google sign-in. Please login with Google."

      });

    }



    const match = await bcrypt.compare(
      password,
      user.password
    );


    if (!match) {

      return res.status(400).json({
        error: "Wrong password"
      });

    }


    res.json({

      message: "Login successful",
      name: user.name

    });



  } catch(error) {


    res.status(500).json({
      error: error.message
    });


  }

});






// GOOGLE OAUTH
router.post("/google", async (req, res) => {


  try {


    const { credential } = req.body;



    const ticket = await client.verifyIdToken({

      idToken: credential,

      audience: GOOGLE_CLIENT_ID

    });



    const payload = ticket.getPayload();


    const { sub: googleId, email, name } = payload;



    let user = await User.findOne({ email });



    if (user) {


      if (!user.googleId) {

        user.googleId = googleId;

        await user.save();

      }


      return res.json({

        message: "Login successful",

        name: user.name

      });


    }





    user = new User({

      name: name,

      email: email,

      googleId: googleId

    });



    await user.save();



    res.json({

      message: "Account created with Google",

      name: user.name

    });



  } catch(error) {


    res.status(500).json({

      error: "Google authentication failed"

    });


  }


});







// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {


  try {


    const { email, password } = req.body;



    const user = await User.findOne({ email });



    if (!user) {


      return res.status(404).json({

        error: "User not found"

      });


    }



    const hashedPassword = await bcrypt.hash(password, 10);



    user.password = hashedPassword;



    await user.save();



    res.json({

      message: "Password updated successfully"

    });



  } catch(error) {


    res.status(500).json({

      error: error.message

    });


  }


});






module.exports = router;