import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import GroupsPage from './pages/GroupsPage';
import MembersPage from './pages/MembersPage';
import ExpensesPage from './pages/ExpensesPage';

import "./App.css";

class App extends Component {
	render() {
		// TODO: Replace this with pulling the real user data from the Redux store
		const account = {name:"Person 1", id: "5f0749c0b051362368853541", token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDc0OWMwYjA1MTM2MjM2ODg1MzU0MSIsIm5hbWUiOiJQZXJzb24gMSIsImlhdCI6MTU5NDQwNTY5OCwiZXhwIjoxNjI1OTYyNjI0fQ.tJier201g01rmMQjwZFaWNF03M0-1eubJ4_fyAGU9Gg"};
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Switch>
						<Route exact path = "/" component={Landing} />
						<Route exact path = "/register" component={Register} />
						<Route exact path = "/login" component={Login} />
						<Route exact path="/groups">
							<GroupsPage account={account}/>
						</Route>
						<Route exact path="/group/:groupId/members">
							<MembersPage account={account}/>
						</Route>
						<Route exact path="/group/:groupId/expenses">
							<ExpensesPage account={account}/>
						</Route>
						<Route>
							404 Page Not Found
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;