import React, { useState } from 'react';
import "../NewGroupModal.css";

function NewGroupModal({onCancel, account, onNewGroup}) {
	const [groupName, setGroupName] = useState("");
	const [groupDescription, setGroupDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState();
	return (
		<div className="meridian-modal">
		<div className="meridian-modal-content">
			<div className="meridian-modalHeader">
				<h1 className="meridian-modalTitle">Add group</h1>
			<button style = { {backgroundColor: 'red', width: '30px'} }className="meridian-button meridian-closeBtn" disabled={isSaving} onClick={() => {
				onCancel()}}>X</button>
			</div>
				<div>
					<label>
						{/* <div>
						Group name
						</div> */}
					<input  id = 'groupNameInput' placeholder = 'Group name here' type="text" disabled={isSaving} autoFocus value={groupName} onChange={(e) => {setGroupName(e.target.value)}}/>
					<input  id = 'groupDescriptionInput' placeholder = 'Group description here' type="text" disabled={isSaving} value={groupDescription} onChange={(e) => {setGroupDescription(e.target.value)}}/>
					</label>
					<div>
						{message}
					</div>
					<div><button disabled={isSaving} className="meridian-button createBtn" onClick={() => {
						setIsSaving(true);
						setMessage("Saving...");
						fetch(`/draftapi/user/${account.id}/createGroup`, {
							method: 'POST',
							body: JSON.stringify({name: groupName, description: groupDescription}),
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
							onNewGroup(result.group);
						},
						error => {
							setMessage("Error saving");
							console.error(error);
						})

					}}>Create</button></div>
				</div>

</div>
</div>
	);
}

export default NewGroupModal;



