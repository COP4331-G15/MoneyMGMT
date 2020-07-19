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

   // Password checks
   if (data.passwordNew != data.passwordNew2) {
      errors.passwordNew2 = "Password does not match.";
   }

   return {
      errors,
      isValid: isEmpty(errors)
   };
};
