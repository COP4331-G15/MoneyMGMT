import React, {useState, useEffect} from 'react';
import Balance from '../components/Balance';
import {Link} from 'react-router-dom';

function GroupsPage({account}) {
	const [groupsData, setGroupsData] = useState({loaded: false});
	useEffect(() => {
		fetch(`/draftapi/user/${account.id}/groups`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': account.token
			}
		})
		.then(response => response.json().then(result => ({response, result})))
		.then(
			({response, result}) => {
				console.log("Result", result)
				console.log(response.status);
				if (response.status === 401) {
					setGroupsData({loaded: false, error: "You don't have permission"});
				} else if (response.status === 200) {
					setGroupsData({loaded: true, groups: result.groups});
				} else {
					setGroupsData({loaded: false, error: "Error"});
				}
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
				setGroupsData({loaded: false, error: "Error"});
			}
		)
	}, [account]);
	let groups;
	if (groupsData.loaded) {
		groups = displayGroups(groupsData.groups);
	} else if (groupsData.error) {
		groups = <span>{groupsData.error}</span>
	} else {
		groups = "Loading...";
	}
	return (
		<div>
			<h1>Your groups:</h1>
			<div>
				<button className="button newGroupBtn">New group</button>
			</div>
			<div>
				{groups}
			</div>
		</div>
	);
}

function displayGroups(groups) {
	return (
		<ul className="groupList">
			{groups.map(group => (
				<li key={group.id} className="groupEntry">
					<div>Name: {group.name}</div>
					{/*<div className="groupTotalExpenses">Total expenses: ${group.totalExpenses}</div>*/}
					<div className="groupUserBalance">Your balance: <Balance bal={group.balance}/></div>
					<div>
						<Link to={`/group/${group.id}/members`} className="button group__viewmembers">View members</Link>
						<Link to={`/group/${group.id}/expenses`} className="button group__viewexpenses">View expense log</Link>
					</div>
				</li>
			))}
		</ul>
	);
}

export default GroupsPage;