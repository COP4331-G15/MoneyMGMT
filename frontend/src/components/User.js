import React from 'react';

function User({other, me}) {
	return <span>{other.name + (other.id === me.id ? " (You)" : "")}</span>
}

export default User;