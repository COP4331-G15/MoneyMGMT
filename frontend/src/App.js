import React, {useState} from 'react';
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
	const [account, setAccount] = useState({name:"Person 1", id: "5f0749c0b051362368853541", token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDc0OWMwYjA1MTM2MjM2ODg1MzU0MSIsIm5hbWUiOiJQZXJzb24gMSIsImlhdCI6MTU5NDQwNTY5OCwiZXhwIjoxNjI1OTYyNjI0fQ.tJier201g01rmMQjwZFaWNF03M0-1eubJ4_fyAGU9Gg"})
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
						<GroupsPage account={account}/>
					</Route>
					<Route exact path="/group/:groupId/members">
						<MembersPage account={account}/>
					</Route>
					<Route exact path="/group/:groupId/expenses">
						<ExpensesPage account={account}/>
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
