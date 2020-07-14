// check localStorage for a token to keep the user logged in even if they close or refresh app (e.g until they log out or the token expires)


import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";

import "./App.css";

// Token Check to keep user logged in 
if (localStorage.jwtToken)
{
	// set auth token header auth
	const token = localStorage.jwtToken;
	setAuthToken(token);
	// Decode token and get User's info and expiration
	const decoded = jwt_decode(token);
	// Set user and isAuth
	store.dispatch(setCurrentUser(decoded));

	// Expired token check
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser());

		// Login redirect
		window.location.href = "./login";
	}
}

class App extends Component {
	render() {
		return (
			<Provider store = {store}>
			<Router>
				<div className="App">
					<Navbar />
					<Route exact path = "/" component={Landing} />
					<Route exact path = "/register" component={Register} />
					<Route exact path = "/login" component={Login} />
					<Switch>
						<PrivateRoute exact path="/dashboard" component= { Dashboard } />
					</Switch>
				</div>
			</Router>
			</Provider>
		);
	}
}

export default App;