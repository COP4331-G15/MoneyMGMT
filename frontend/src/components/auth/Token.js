import React, { Component } from "react";
import { connect } from "react-redux";
import { getVerifyUser } from "../../actions/tokenAction";

class Token extends Component {
   constructor(props) {
      super(props);
   }

   // called before initial render
   componentWillMount() {
      this.props.getVerifyUser(this.props.match.params.token);
      console.log("token", this.props.match.params.token);
   }

   render() {
      return (
         <div>
            <h3 className="lead text-muted text-center">
               Your activation token has been confirmed, you can now sign in.
            </h3>
         </div>
      );
   }
}

export default connect(null, {getVerifyUser})(Token);

export function getVerifyUser(token) {
   return dispatch => {
      console.log("put request");
      axios
      .put(`/api/users/verify/${token}`)
      .then(res => {})
      .catch(err => console.log(err));
   }
};
