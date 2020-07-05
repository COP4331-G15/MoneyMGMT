import React, {useState, useEffect} from 'react';
import Balance from '../components/Balance';
import {Link} from 'react-router-dom';

function GroupsPage({userId}) {
	const [groupsData, setGroupsData] = useState({loaded: false});
	useEffect(() => {
		fetch(`/fakeapi/user/${userId}/groups`)
		.then(res => res.json())
		.then(
			(result) => {
				setGroupsData({loaded: true, groups: result.groups});
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
			}
		)
	}, [userId]);
	const groups = !groupsData.loaded ? "Loading..." : displayGroups(groupsData.groups);
	return (<div>
		<h1>Your groups:</h1>
		{groups}
		</div>);
}

function displayGroups(groups) {
	return (
		<ul className="groupList">
			{groups.map(group => (
				<li key={group.id} className="groupEntry">
					<div>Name: {group.name}</div>
					<div className="groupTotalExpenses">Total expenses: ${group.totalExpenses}</div>
					<div className="groupUserBalance">Your balance: <Balance bal={group.userBalance}/></div>
					<div><Link to={`/group/${group.id}/members`} className="group__viewmembers">View members</Link><Link to={`/group/${group.id}/expenses`} className="group__viewexpenses">View expense log</Link></div>
				</li>
			))}
		</ul>
	);
}

export default GroupsPage;