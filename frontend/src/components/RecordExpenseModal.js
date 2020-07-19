import React, { useState, useEffect } from 'react';
import "../NewGroupModal.css";

function RecordExpenseModal({onCancel, account, groupId, onNewExpense}) {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState();
	const [membersData, setMembersData] = useState({loaded: false});

	const [selectedMember, setSelectedMember] = useState(null);
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
					setMembersData({loaded: false, error: "No permission"});
				} else if (response.status === 200) {
					setSelectedMember(result.members[0].id);
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
	let modalBody;
	const handleChangeSelectedMember = (e) => {
		setSelectedMember(e.target.value);
	}

	if (membersData.loaded) {
		const memberSelect = (
			<select value={selectedMember} className="browser-default memberSelect" onChange={handleChangeSelectedMember}>
				{membersData.members.map(member => {
					return (<option value={member.id}>{member.name}</option>);
				})}
			</select>
		);
		modalBody = (
			<div>
						{/* <div>
						Group name
						</div> */}
						Billed Member: {memberSelect}
					<input id='expenseDescriptionInput' placeholder = 'Expense description' type="text" disabled={isSaving} autoFocus value={description} onChange={(e) => {setDescription(e.target.value)}}/>
					<input id='expenseAmountInput' placeholder = 'Amount' type="number" disabled={isSaving} value={amount} onChange={(e) => {setAmount(e.target.valueAsNumber)}}/>
					<div>
						{message}
					</div>
					<div><button disabled={isSaving} className="meridian-button createBtn" onClick={() => {
						setIsSaving(true);
						setMessage("Saving...");
						fetch(`/draftapi/group/${groupId}/recordExpense`, {
							method: 'POST',
							body: JSON.stringify({payer: account.id, description: description, amount: amount, billed: selectedMember}),
							headers: {
								'Content-Type': 'application/json',
								'Authorization': account.token
							}
						}).then(response => response.json().then(result => ({response, result})))
						.then(({response, result}) => {
							if (response.status !== 200 || result.error) {
								setMessage("Error: "+result.error);
								setIsSaving(false);
								return;
							}
							onNewExpense();
						},
						error => {
							setMessage("Error saving");
							console.error(error);
						})

					}}>Save</button></div></div>);
	} else if (membersData.error) {
		modalBody = (<div>{membersData.error}</div>);
	}else {
		modalBody = (<div>Loading</div>);
	}

	return (
		<div className="meridian-modal">
			<div className="meridian-modal-content">
				<div className="meridian-modalHeader">
					<h1 className="meridian-modalTitle">Record expense</h1>
					<button style = { {backgroundColor: 'red', width: '30px'} }className="meridian-button meridian-closeBtn" disabled={isSaving} onClick={() => {
						onCancel()}}>X</button>
				</div>
				{modalBody}
			</div>
		</div>
	);
}

export default RecordExpenseModal;



