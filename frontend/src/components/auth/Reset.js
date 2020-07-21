import React, {useState, Component } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

function Reset() {
   const {userId, token} = useParams();
   const [password1, setPassword1] = useState("");
   const [password2, setPassword2] = useState("");
   const [errors, setErrors] = useState({});
   const [message, setMessage] = useState("");

   const onSubmit = (e) => {
      e.preventDefault();
      const sendRequest = async () => {
         const response = await fetch(`/api/users/resetPassword`, {
            method: 'POST',
            body: JSON.stringify({password: password1, password2: password2, userId: userId, resetToken: token}),
            headers: { 'Content-Type': 'application/json' }
         });

         const result = await response.json();
         setErrors({});
         console.log(result);
         if (result.errors) {
            setErrors(result.errors);
            return;
         }

         if (response.status === 200 && result.success) {
            setMessage("Your password has been reset!");
         }
         
      };
      
      sendRequest();
   }
   return ( <div className="container">
      <div style={{ marginTop: "4rem" }} className="row">
         <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
               <i className="material-icons left">keyboard_backspace</i> Back to home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
               <h4>
                  <b>Reset</b> your password
               </h4>
            </div>
            <form noValidate onSubmit={onSubmit}>
               <div className="input-field col s12">
                  <input
                     onChange={(e) => {setPassword1(e.target.value)}}
                     value={password1}
                     error={errors.password}
                     id="email"
                     type="password"
                     className={classnames("", {invalid: errors.password})}
                  />
                  <label htmlFor="email">Password</label>
                  <span className="red-text">
                     {errors.password}
                  </span>
               </div>
               <div className="input-field col s12">
                  <input
                     onChange={(e) => {setPassword2(e.target.value)}}
                     value={password2}
                     error={errors.password2}
                     id="password"
                     type="password"
                     className={classnames("",{invalid: errors.password2})}
                  />
                  <label htmlFor="password">Confirm password</label>
                  <span className="red-text">
                     {errors.password2}
                  </span>
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
                     Submit
                  </button>
                  <div>
                     {message}
                  </div>
               </div>
            </form>
         </div>
      </div>
   </div>
   );
}

export default Reset;
