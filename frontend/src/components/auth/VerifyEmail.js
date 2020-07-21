import React, { Component } from "react";
import { Link } from "react-router-dom";

class VerifyEmail extends Component {
   render() {
      return (
         <div style={{ height: "75vh" }} className="container valign-wrapper">
            <div className="row">
               <div className="col s12 center-align">
                  <h4>
                     <b>Thank you!</b> Please check your email to verify your account and login...{" "}
                  </h4>
                  <br />
               </div>
            </div>
         </div>
      );
   }
}

export default VerifyEmail;
