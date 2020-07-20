import React, {useState, Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

function ResetPassword() {
   const [email, setEmail] = useState("");
   const [emailSent, setEmailSent] = useState(false);

   const onSubmit = (e) => {
      e.preventDefault();
      setEmailSent(true);

      const sendRequest = async () => {
         const response = await fetch(`/api/users/resetpassword`, {
            method: 'POST',
            body: JSON.stringify({email: email}),
            headers: { 'Content-Type': 'application/json' }
         });

         const result = await response.json();
         console.log(result);
      };

      sendRequest();
   };

   return (
      <div className="container">
         <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
               <Link to="/" className="btn-flat waves-effect">
                  <i className="material-icons left">keyboard_backspace</i> Back to
                  home
               </Link>
               <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                  <h4>
                     <b>Reset password</b> below
                  </h4>
                  <p className="grey-text text-darken-1">
                      Don't have an account? <Link to="/register">Register</Link>
                  </p>
               </div>
               <form noValidate onSubmit={onSubmit}>
                  <div className="input-field col s12">
                     <input
                        onChange={(e) => {setEmail(e.target.value);}}
                        value={email}
                        id="email"
                        type="email"
                        disabled={emailSent}
                     />
                     <label htmlFor="email">Email</label>
                     {emailSent ? "Email sent" : null}
                     {/*<span className="red-text">
                        {errors.email}{errors.emailnotfound}
                     </span>*/}
                  </div>
                  <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                     <button
                        style={{
                           width: "150px",
                           borderRadius: "3px",
                           letterSpacing: "1.5px",
                           marginTop: "1rem"
                        }}
                        type="submit"
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                     >
                        Reset
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}

export default ResetPassword;
