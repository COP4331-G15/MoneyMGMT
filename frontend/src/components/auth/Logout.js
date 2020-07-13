import React, { Component } from "react";
import { Link } from "react-router-dom";
import 'whatwg-fetch';

class Logout extends Component {
   constructor() {
      super();

      this.state = {
         isLoading: true,
         token: '',
         email: "",
         password: "",
         errors: {}
      };
   }

   onSubmit = e => {
      e.preventDefault();

      const userData = {
         email: "",
         password: ""
      };

      console.log(userData);
   };
}

export default Logout;
