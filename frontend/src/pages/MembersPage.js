import React, {useState, useEffect} from 'react';
import Balance from '../components/Balance';
import {Link, useParams} from "react-router-dom";

function MembersPage() {
	let { groupId } = useParams();
	// TODO: current userId
	let userId = "fakeuserid";
	const [membersData, setMembersData] = useState({loaded: false});
	useEffect(() => {
		
		fetch(`/fakeapi/group/${groupId}/balance/${userId}`)
		.then(res => res.json())
		.then(
			(result) => {
				setMembersData({loaded: true, members: result.members});
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
			}
		)
	}, [groupId, userId])
	const members = !membersData.loaded ? "Loading..." : displayMembers(membersData.members);
	return (
		<div>
			<h1>Member List</h1>
			{members}
		</div>
	);
}

function displayMembers(members) {
	return (
		<ul className="memberList">
			{members.map(member => (
				<li key={member.id} className="groupMember">
					<div>{member.name}</div>
					<div className="yourBalance">Your balance: <Balance bal={member.amount}/></div>
					<div><Link to="" className="paybackBtn">Pay back</Link></div>
				</li>
			))}
		</ul>
	);
}

export default MembersPage;