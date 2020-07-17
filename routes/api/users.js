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
            password: req.body.password
         });

         // Hashing pwd before saving in DB
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
               if (err) throw err;
               newUser.password = hash;
               newUser
               .save()
               .then(user => res.json(user))
               .catch(er => console.log(err));
            });
         });
      }
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
