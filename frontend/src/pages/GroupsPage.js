import React, {useState, useEffect} from 'react';
import Balance from '../components/Balance';
import NewGroupModal from '../components/NewGroupModal';
import {Link} from 'react-router-dom';
import { connect } from "react-redux";
import useDarkMode from '../components/UseDarkMode';

function GroupsPage({account}) {
	useDarkMode();

	const [groupsData, setGroupsData] = useState({loaded: false});
	const [modalActive, setModalActive] = useState(false);

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
			<h1 className = "H1"><span>Your</span> groups</h1>
			<div className = 'line'></div>
			<div>
				<button style = { {position: 'absolute', right: '10px', top: '135px', fontWeight: 'bold'} } 
						className="meridian-button newGroupBtn" 
						onClick={() => {setModalActive(true)}}>
						<h6 className = 'H6'>Create group</h6>
				</button>
			</div>
			<div>
				{groups}
			</div>
			{modalActive ? <NewGroupModal account={account} onCancel={() => {
				setModalActive(false);}}
				onNewGroup={(group) => {
					setModalActive(false);
					setGroupsData(groupsData => {
						return {loaded: true, groups: [group, ...groupsData.groups]};
					});
				}}
			/> : null}
		</div>
	);
}

function displayGroups(groups) {
	if (groups.length === 0) {
		return (
			<h2>You do not have any groups yet. Create one using the button at the top right.</h2>
		)
	}
	return (
		<ul style = {{left: '36%'}}className="groupList">
			{groups.map(group => (
				<li style = { {textAlign: 'center', backgroundColor: 'black'} }key={group.id} className="groupEntry">
					<h5 style={{ marginTop: "0px", fontWeight: 'bold' }}>Name: {group.name}</h5>
					Description: {group.description}
					{/*<div className="groupTotalExpenses">Total expenses: ${group.totalExpenses}</div>*/}
					<div className="groupUserBalance">Your balance: <Balance bal={group.balance}/></div>
					<div /*style = { {position: "absolute", left: "300px"} }*/>
						<Link to={`/group/${group.id}/members`} className="meridian-button group__viewmembers">View members</Link>
						<Link to={`/group/${group.id}/expenses`} className="meridian-button group__viewexpenses">View expense log</Link>
					</div>
				</li>
			))}
		</ul>
	);
}

const mapStateToProps = state => ({
    account: state.auth.user
});

export default connect(mapStateToProps)(GroupsPage);