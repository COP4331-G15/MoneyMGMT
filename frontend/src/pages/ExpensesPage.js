import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import { connect } from "react-redux";
import User from '../components/User';
import useDarkMode from '../components/UseDarkMode';
import RecordExpenseModal from "../components/RecordExpenseModal";

function ExpensesPage({account}) {
	useDarkMode();

	let { groupId } = useParams();
	const [expenseData, setExpenseData] = useState({loaded: false});
	const [modalActive, setModalActive] = useState(false);

	const loadExpenses = () => {
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
					setExpenseData({loaded: true, expenses: result.expenses, group: result.group});
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
	};
	useEffect(() => {
		loadExpenses();
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
		<h1 className = 'H1'>{!expenseData.group ? null : expenseData.group.name} Expense Log</h1>
		<div className = 'line'></div>
		<div>
		<button style = { {position: 'absolute', right: '10px', top: '135px', fontWeight: 'bold'} } 
						className="meridian-button newGroupBtn" 
						onClick={() => {
							setModalActive(true);
						}}>
						<h6 className = 'H6'>Record expense</h6>
				</button>
		</div>
		<div>
		{expenses}
		</div>
		{modalActive ? <RecordExpenseModal groupId={groupId} account={account} onCancel={() => {
				setModalActive(false);}}
				onNewExpense={() => {
					setModalActive(false);
					setExpenseData({loaded: false});
					loadExpenses();
				}}
			/> : null}
		</div>);
}

function displayExpenses(expenses, account) {
	if (expenses.length === 0) {
		return (
			<h3 className="noExpenses">You have not recorded any expenses yet.</h3>
		)
	}
	return (
		<ul className="expenseList">
			{expenses.map(expense => (
				<li key={expense.id} className="expense">
					<div className="expenseTagLine"><User other={expense.payer} me={account}/> <span className="paidFor">paid for</span> <User other={expense.billed} me={account}/></div>
					<div className="expenseAmount">${expense.amount}</div>
					<div className="expenseDescription">Description: {expense.description}</div>
					<div className="expenseTime">{new Date(expense.time).toLocaleString()}</div>
				</li>
			))}
	</ul>
	);
}

const mapStateToProps = state => ({
    account: state.auth.user
});

export default connect(mapStateToProps)(ExpensesPage);