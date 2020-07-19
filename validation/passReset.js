const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePassReset(data) {
   let errors = {};

   // Convert empty fields to an empty string so we can use validator functions
   data.passwordNew = !isEmpty(data.passwordNew) ? data.passwordNew : "";
   data.passwordNew2 = !isEmpty(data.passwordNew2) ? data.passwordNew2 : "";

   // Password checks
   if (Validator.isEmpty(data.passwordNew)) {
      errors.passwordNew = "New password is required";
   }
   if (!Validator.isLength(data.passwordNew, { min: 6, max: 30 })) {
      errors.password = "Password must be at least 6 characters";
   }
   if (!Validator.equals(data.passwordNew, data.passwordNew2)) {
      errors.password2 = "Passwords must match";
   }

   return {
      errors,
      isValid: isEmpty(errors)
   };
};
