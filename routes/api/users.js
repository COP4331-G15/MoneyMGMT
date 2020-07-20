const express = require( "express" );
const router = express.Router();
const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const keys = require( "../../config/keys" );
const passport = require("passport");
const crypto = require('crypto');
const {ObjectID} = require("mongodb");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("API KEY", process.env.SENDGRID_API_KEY);
// Load the input validation
const validateRegInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require("../../server/models/User");

//const e = require("express");
//const { brotliCompress } = require("zlib");
const { ExtractJwt } = require("passport-jwt");

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
         crypto.randomBytes(5, function(err, buffer) {
            const token = buffer.toString('hex');
            const newUser = new User({
               name: req.body.name,
               email: req.body.email,
               password: req.body.password,
               tempToken: token
            });

            // Hashing pwd before saving in DB
            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) {
                     console.log("Error", err);
                     throw err;
                  }
                  newUser.password = hash;
                  newUser
                  .save()
                  .then(user => {

                     const link = `http://localhost:3000/verify/${newUser._id}/${newUser.tempToken}`;
                     var data = {
                        //Specify email data
                        from: "meridian@ucfclassproject.xyz",
                        //The email to contact
                        to: newUser.email,
                        //Subject and text data  
                        subject: 'Meridian - Confirm your email',
                        html: 'Hello<strong> ' + newUser.name +
                        '</strong>,<br><br>Activation link:<br><br><a href="' + link
                        + '">'+link+'</a>'
                     };
                        sgMail.send(data);
                        res.json({success: true, message: "Account has been registered! To activate your account, please check your e-mail and follow the instructions provided."});
                    });
                  })
       
               });
            });

            // Send validation email

            //console.log(newUser.email);

            /*client.sendMail(emailPL, function(err, info) {
               if (err) {
                  console.log(err);
               }
               else {
                  console.log('Message sent: ' + info.response);
               }
            });*/
            
         }
         //res.json({success: true, message: "Account has been registered! To activate your account, please check your e-mail and follow the instructions provided."});
   });
});

router.post("/confirmEmail", (req, res) => {
   if (!ObjectID.isValid(req.body.userId)) {
      res.status(400);
      res.json({error: "Invalid link"});
      return;
   }
   User.findOne({_id: new ObjectID(req.body.userId), tempToken: req.body.token}).then(
      user => {
         if (!user) {
            res.status(400);
            res.json({error: "Invalid link"})
            return;
         }
         user.active = true;
         user.tempToken = "";
         user.markModified("active");
         user.markModified("tempToken");
         user.save();
         res.send(user)
      }
   );
});

function doPasswordReset(res, user) {
   crypto.randomBytes(5, function(err, buffer) {
      const token = buffer.toString('hex');
      user.resetToken = token;
      user.markModified("resetToken");
      user.save((err) => {
         const link = `http://localhost:3000/reset/${user._id}/${user.resetToken}`;
         var data = {
            //Specify email data
            from: "meridian@ucfclassproject.xyz",
            //The email to contact
            to: user.email,
            //Subject and text data  
            subject: 'Meridian - Password Reset',
            html: 'Hello<strong> ' + user.name +
            '</strong>,<br><br>Reset link:<br><br><a href="' + link
            + '">'+link+'</a>'
         };
         sgMail.send(data);
         res.json({success: true});
      })
   });
}

router.post("/resetpassword", (req, res) => {
   const email = req.body.email;
   User.findOne({email: email}).then(
      user => {
         if (!user) {
            res.status(200);
            res.json({success: true});
            return;
         }
         
         doPasswordReset(res, user);
      }
   );
});


// @route PUT api/users/verify/:token
// @desc Activate the user's account
// @access Public
/*router.put("/verify/:token", (req, res) => {
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
});*/

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
      if (!user.active) {
         res.status(400).json({emailnotfound: "Email has not been verified"});
         return;
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
