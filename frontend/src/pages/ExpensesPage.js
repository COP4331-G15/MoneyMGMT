import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import User from '../components/User';

function ExpensesPage({account}) {
	let { groupId } = useParams();
	const [expenseData, setExpenseData] = useState({loaded: false});
	useEffect(() => {
		
		fetch(`/draftapi/group/${groupId}/expenses`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': account.token
			}
		})
		.then(response => response.json().then(result => ({response, result})))
		.then(
			({response, result}) => {
				console.log(response.status);
				if (response.status === 401) {
					setExpenseData({loaded: false, error: "You don't have permission"});
				} else if (response.status === 200) {
					setExpenseData({loaded: true, expenses: result.expenses});
				} else {
					setExpenseData({loaded: false, error: "Error"});
				}
				
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
				setExpenseData({loaded: false, error: "Error"});
			}
		)
	}, [groupId, account]);
	let expenses;
	if (expenseData.loaded) {
		expenses = displayExpenses(expenseData.expenses, account);
	} else if (expenseData.error) {
		expenses = <span>{expenseData.error}</span>
	} else {
		expenses = "Loading...";
	}
	return (<div>
		<h1>&lt;Insert group name&gt; Expense Log</h1>
		{expenses}
		</div>);
}

function displayExpenses(expenses, account) {
	return (
		<ul className="expenseList">
			{expenses.map(expense => (
				<li key={expense.id} className="expense">
					<div><User other={expense.payer} me={account}/> paid for <User other={expense.billed} me={account}/></div>
					<div>${expense.amount}</div>
					<div>Description: {expense.description}</div>
				</li>
			))}
	</ul>
	);
}

export default ExpensesPage;