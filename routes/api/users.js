const express = require( "express" );
const router = express.Router();
const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const keys = require( "../../config/keys" );
const passport = require("passport");

// Load the input validation
const validateRegInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require("../../server/models/User");

//const e = require("express");
//const { brotliCompress } = require("zlib");
const { ExtractJwt } = require("passport-jwt");

// Email setup
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

var options = {
   auth: {
      api_user: 'atraub24@knights.ucf.edu',
      api_key: '6KZzBfbsTq^??m$'
  }
}

const client = nodemailer.createTransport(sgTransport(options));

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
   // Form Validation
   const { errors, isValid } = validateRegInput(req.body);

   // Check validation
   if (!isValid) {
      return res.status(400).json(errors);
   }

   User.findOne({ email: req.body.email }).then(user => {
      if (user) {
         return res.status(400).json({ email: "Email already exists" });
      }
      else {
         const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tempToken: jwt.sign(/*payload*/{email: req.body.email}, keys.secretOrKey, {expiresIn: '12000'})
         });

         // Hashing pwd before saving in DB
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
               if (err) throw err;
               newUser.password = hash;
               newUser
               .save()
               .then(user => res.json(user))
               .catch(err => console.log("Error", err));
            });
         });

         // Send validation email
        var email = {
            from: 'Meridian Staff, staff@meridian.com',
            to: newUser.email, // email , user.email , or newUser.email ?
            subject: 'Meridian Activation Link',
            text: 'Hello ' + newUser.name + ', Activation link: http://localhost:3000/activate/' + newUser.tempToken,
            html: 'Hello<strong> ' + newUser.name +
                  '</strong>,<br><br>Activation link:<br><br><a href="http://localhost:3000/activate/' +
                  newUser.tempToken + '">http://localhost:3000/activate/</a>'
         };
         console.log(newUser.email);

         client.sendMail(email, function(err, info) {
            if (err) {
               console.log(err);
            }
            else {
               console.log('Message sent: ' + info.response);
            }
         });

         //res.json({success: true, message: "Account has been registered! To activate your account, please check your e-mail and follow the instructions provided."});
      }
   });
});

// @route PUT api/users/verify/:token
// @desc Activate the user's account
// @access Public
router.put("/verify/:token", (req, res) => {
   User.findOne({ temporarytoken: req.params.token }, (err, user) => {
      if (err) throw err; // Throw error if cannot login

      const token = req.params.token; // Save the token from URL for verification

      console.log("the token is", token);

      // Function to verify the user's token
      jwt.verify(token, keys.secretOrKey, (err, decoded) => {
         if (err) {
            res.json({ success: false, message: "Activation link has expired." }); // Token is expired
         }
         else if (!user) {
            res.json({ success: false, message: "Activation link has expired." }); // Token may be valid but does not match any user in the database
         }
         else {
            user.temporarytoken = false; // Remove temporary token
            user.active = true; // Change account status to Activated

            // Mongoose Method to save user into the database
            user.save(err => {
               if (err) {
                  console.log(err); // If unable to save user, log error info to console/terminal
               }
               else {
                  // If save succeeds, create e-mail object
                  const emailActivate = {
                     from: "Meridian Staff, staff@meridian.com",
                     to: user.email,
                     subject: "Meridian Account Activated",
                     text: `Hello ${user.name},
                           Your account has been successfully activated!`,
                     html: `Hello<strong> ${user.name}
                           </strong>,<br><br>Your account has been successfully activated!`
                  };

                  // Send e-mail object to user
                  client.sendMail(emailActivate, function(err, info) {
                     if (err) {
                        console.log(err);
                     }
                     else {
                        console.log("Activiation Message Confirmation -  : " + info.response);
                     }
                  });

                  res.json({
                     succeed: true,
                     message: "User has been successfully activated"
                  });
               }
            });
         }
      });
   });
});

// @route POST api/users/login
// @desc Login user and return JWT Token
// @access Public
router.post("/login", (req, res) => {
   // more Form validation
   const { errors, isValid } = validateLoginInput(req.body);

   // Check validation
   if (!isValid) {
      return res.status(400).json(errors);
   }

   const email = req.body.email;
   const password = req.body.password;

   // Find user by email
   User.findOne({ email }).then(user => {
      // Does User Exist?
      if (!user) {
         return res.status(404).json({ emailnotfound: "Email not found" });
      }

      // Pwd Check
      bcrypt.compare(password, user.password).then( isMatch => {
         if (isMatch) {
            // Match , Create JWT payload
            const payload = {
               id:user.id,
               name: user.name,
               email: user.email,
               date: user.date
            };

            jwt.sign(
               payload,
               keys.secretOrKey,
               {
                  // one yr in seconds
                  expiresIn: 31556926
               },
               (err, token) => {
                  res.json({
                     success: true,
                     token: "Bearer " + token,
                     email: user.email,
                     date: user.date
                  });
               }
            );
         }
         else {
            return res
               .status(400)
               .json({ passwordincorrect: "Password incorrect" });
         }
      });
   });
});

// @route POST api/users/logout
// @desc Logout user
// @access Public
// app.get('/logout', (req, res, next) => {
//    // Get the token
//    const { query } = req;
//    const { token } = query;
//    // ?token=test
//    // Verify the token is one of a kind and it's not deleted.
//    UserSession.findOneAndUpdate({
//       _id: token,
//       isDeleted: false
//    }, {
//       $set: {
//          isDeleted:true
//       }
//    }, null, (err, sessions) => {
//       if (err) {
//          console.log(err);
//          return res.send({
//             success: false,
//             message: 'Error: Server error'
//          });
//       }
//       return res.send({
//          success: true,
//          message: 'Good'
//       });
//    });
// });

module.exports = router;
