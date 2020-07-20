import React, { useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import { connect } from "react-redux";
import useDarkMode from '../components/UseDarkMode';

function JoinGroupPage({account}) {
	useDarkMode();
	const history = useHistory();
	const [inviteData, setInviteData] = useState({loaded: false});
	const { groupId, inviteCode } = useParams();
	useEffect(() => {
		fetch(`/draftapi/group/${groupId}/checkInvite/${inviteCode}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': account.token
			}
		})
		.then(response => response.json().then(result => ({response, result})))
		.then(
			({response, result}) => {
				if (response.status === 401) {
					setInviteData({loaded: false, error: "You don't have permission"});
				} else if (response.status === 200) {
					setInviteData({loaded: true, group: result.group});
				} else {
					setInviteData({loaded: false, error: "Error"});
				}
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
				console.error(error);
				setInviteData({loaded: false, error: "Error"});
			}
		)
	}, [account, groupId, inviteCode]);

	const joinGroup = () => {
		fetch(`/draftapi/group/${groupId}/join/${inviteCode}`, {
			method: 'POST',
			body: JSON.stringify({userId: account.id}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': account.token
			}
		}).then(response => response.json().then(result => ({response, result})))
		.then(({response, result}) => {
			if (response.status !== 200 || response.error) {
				setInviteData({error: "Error joining"});
				console.error("Error joining", response);
				return;
			}
			history.push("/groups");
		},
		error => {
			setInviteData({error: "Network/server error"});
			console.error("Network/server error joining", error);
		})
	};
	if (inviteData.error) {
		return "Invalid group invitation";
	}
	if (!inviteData.loaded) {
		return "Loading...";
	}

	return (
		<div>
			<h1>Join {inviteData.group.name}</h1>
			<div>Description: {inviteData.group.description}</div>
			<button class="meridian-button" onClick={joinGroup}>Accept</button>
		</div>
	);
}

const mapStateToProps = state => ({
    account: state.auth.user
});

export default connect(mapStateToProps)(JoinGroupPage);