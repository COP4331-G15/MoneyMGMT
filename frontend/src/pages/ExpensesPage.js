import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";

function ExpensesPage() {
	let { groupId } = useParams();
	const [expenseData, setExpenseData] = useState({loaded: false});
	useEffect(() => {
		
		fetch(`/fakeapi/group/${groupId}/expenses`)
		.then(res => res.json())
		.then(
			(result) => {
				setExpenseData({loaded: true, expenses: result.expenses});
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
			}
		)
	}, [groupId]);
	const expenses = !expenseData.loaded ? "Loading..." : displayExpenses(expenseData.expenses);
	return (<div>
		<h1>&lt;Insert group name&gt; Expense Log</h1>
		{expenses}
		</div>);
}

function displayExpenses(expenses) {
	return (
		<ul className="expenseList">
			{expenses.map(expense => (
				<li key={expense.id} className="expense">
					<div>Description: {expense.desc}</div>
					<div className="expense__amount">Amount: ${expense.amount}</div>
					<div>Payer: {expense.payer}</div>
					<div className="expense__participants">Participants: {expense.participants.join(", ")}</div>
				</li>
			))}
	</ul>
	);
}

export default ExpensesPage;