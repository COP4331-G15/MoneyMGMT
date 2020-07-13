import React, { useState } from 'react';
import "../NewGroupModal.css";

function NewGroupModal({onCancel, account, onNewGroup}) {
	const [groupName, setGroupName] = useState();
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState();
	return (
		<div className="modal">
		<div className="modal-content">
			<div className="modalHeader">
				<h1 className="modalTitle">Add group</h1>
			<button className="button closeBtn" disabled={isSaving} onClick={() => {
				onCancel()}}>Close</button>
			</div>
				<div>
					<label>
						<div>
						Group name
						</div>
					<input type="text" disabled={isSaving} autoFocus value={groupName || ''} onChange={(e) => {setGroupName(e.target.value)}}/>
					</label>
					<div>
						{message}
					</div>
					<div><button disabled={isSaving} className="button" onClick={() => {
						setIsSaving(true);
						setMessage("Saving...");
						fetch(`/draftapi/user/${account.id}/createGroup`, {
							method: 'POST',
							body: JSON.stringify({name: groupName}),
							headers: {
								'Content-Type': 'application/json',
								'Authorization': account.token
							}
						}).then(response => response.json().then(result => ({response, result})))
						.then(({response, result}) => {
							if (response.status !== 200 || response.error) {
								setMessage("Error saving");
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


