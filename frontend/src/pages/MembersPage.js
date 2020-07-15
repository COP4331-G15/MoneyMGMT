import React, {useState, useEffect} from 'react';
import Balance from '../components/Balance';
import {Link, useParams} from "react-router-dom";
import User from '../components/User';
import useDarkMode from '../components/UseDarkMode';

function MembersPage({account}) {
	useDarkMode();

	let { groupId } = useParams();
	const [membersData, setMembersData] = useState({loaded: false});
	useEffect(() => {
		
		fetch(`/draftapi/group/${groupId}/balance/${account.id}`, {
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
					setMembersData({loaded: false, error: "You don't have permission"});
				} else if (response.status === 200) {
					setMembersData({loaded: true, members: result.members, group: result.group});
				} else {
					setMembersData({loaded: false, error: "Error"});
				}
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
				setMembersData({loaded: false, error: "Error"});
			}
		)
	}, [groupId, account])
	let members;
	if (membersData.loaded) {
		members = displayMembers(membersData, account);
	} else if (membersData.error) {
		members = <span>{membersData.error}</span>
	} else {
		members = "Loading...";
	}
	return (
		<div>
			<h1 className = 'H1' style = {{marginLeft: '10px'}}>Member List</h1>
			{members}
		</div>
	);
}

function displayMembers({members, group}, account) {
	const inviteLink = `${window.origin}/group/${group.id}/join/${group.inviteCode}`;
	return (
		<div>
			<div className = 'line'></div>
			<div style = {{marginTop: '20px', marginLeft: '40px'}}> 
			<span style = { {fontSize: 'x-large', position: 'relative', top: '10px', height: '30px'}}>Invite link:</span>
				<input style = { {padding: '0px 10px', borderRadius: '4px', height: '30px'} }type="text" readonly className="meridian-button groupInviteLink" value={inviteLink}/>
				<button  style = { {paddingTop: '7.5px', paddingLeft: '5px'} }className="meridian-button" data-position="bottom" data-tooltip="Link copied"
				onClick={(e) => {
					navigator.clipboard.writeText(inviteLink);
					const instance = window.M.Tooltip.init(e.target);
					instance.open();
					e.target.onmouseleave = () => {instance.destroy()};
				}}>
					<i  style = { {marginRight: '7px'} } className="material-icons left">content_copy</i>
					Copy
				</button>
				
			</div>
			<ul className="memberList">
				{members.map(member => (
					<li key={member.id} className="groupMember">
						<h5><User other={member} me={account}/></h5>
						<div className="yourBalance">Your balance: <Balance bal={member.balance}/></div>
						<div><Link to="" className="meridian-button paybackBtn">Pay back</Link></div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default MembersPage;