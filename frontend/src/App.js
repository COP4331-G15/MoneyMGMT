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
import Token from "./components/auth/Token";
import ResetPassword from "./components/auth/ResetPassword";
import PrivateRoute from "./components/private-route/PrivateRoute";

import GroupsPage from './pages/GroupsPage';
import MembersPage from './pages/MembersPage';
import ExpensesPage from './pages/ExpensesPage';
import JoinGroupPage from './pages/JoinGroupPage';

import "./App.css";

// Token Check to keep user logged in
if (localStorage.jwtToken)
{
	// set auth token header auth
	const token = localStorage.jwtToken;
	setAuthToken(token);
	// Decode token and get User's info and expiration
	const decoded = jwt_decode(token);
	Object.assign(decoded, {token: token});
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
					<Switch>
						<Route exact path = "/" component={Landing} />
						<Route exact path = "/register" component={Register} />
						<Route exact path = "/login" component={Login} />
						<Route exact path = "/passwordreset" component={ResetPassword}/>
						<Route exact path = "/verify/:userId/:token" component={Token} />
						<PrivateRoute exact path="/groups" component={GroupsPage}/>
						<PrivateRoute exact path="/group/:groupId/members" component={MembersPage}/>
						<PrivateRoute exact path="/group/:groupId/expenses" component={ExpensesPage}/>
						<PrivateRoute exact path="/group/:groupId/join/:inviteCode" component={JoinGroupPage}/>
						<Route>
							404 Page Not Found
						</Route>
					</Switch>
				</div>
			</Router>
			</Provider>
		);
	}
}

export default App;
