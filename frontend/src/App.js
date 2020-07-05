import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage"
import RegisterPage from './pages/RegisterPage';
import GroupsPage from './pages/GroupsPage';
import MembersPage from './pages/MembersPage';
import ExpensesPage from './pages/ExpensesPage';

function App() {
	return (
		<Router>
			<Switch>
					<Route exact path="/login">
						<LoginPage/>
					</Route>
					<Route exact path="/register">
						<RegisterPage/>
					</Route>
					<Route exact path="/groups">
						<GroupsPage userId="whatever"/>
					</Route>
					<Route exact path="/group/:groupId/members">
						<MembersPage/>
					</Route>
					<Route exact path="/group/:groupId/expenses">
						<ExpensesPage/>
					</Route>
					<Route exact path="/">
						<Link to="/groups">View your groups</Link>
					</Route>

					<Route path="/">
						404
					</Route>
				</Switch>
				</Router>
	);
}

export default App;
