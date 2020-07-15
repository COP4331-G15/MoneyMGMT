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
		// TODO: Replace this with pulling the real user data from the Redux store
		const account = {name:"Person 1", id: "5f0749c0b051362368853541", token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDc0OWMwYjA1MTM2MjM2ODg1MzU0MSIsIm5hbWUiOiJQZXJzb24gMSIsImlhdCI6MTU5NDQwNTY5OCwiZXhwIjoxNjI1OTYyNjI0fQ.tJier201g01rmMQjwZFaWNF03M0-1eubJ4_fyAGU9Gg"};
		return (
			<Provider store = {store}>
			<Router>
				<div className="App">
					<Navbar />
					<Switch>
						<Route exact path = "/" component={Landing} />
						<Route exact path = "/register" component={Register} />
						<Route exact path = "/login" component={Login} />
						<PrivateRoute exact path="/dashboard" component= { Dashboard } />
						<Route exact path="/groups">
							<GroupsPage account={account}/>
						</Route>
						<Route exact path="/group/:groupId/members">
							<MembersPage account={account}/>
						</Route>
						<Route exact path="/group/:groupId/expenses">
							<ExpensesPage account={account}/>
						</Route>
						<Route exact path="/group/:groupId/join/:inviteCode">
							<JoinGroupPage account={account}/>
						</Route>
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
