import React from 'react';

function Balance({bal}) {
	// For our purposes, 0 is considered positive
	const className = bal >= 0 ? 'balancePositive' : 'balanceNegative';
	const sign = bal >= 0 ? '+' : '-';
	return <span className={className}>{sign + '$' + Math.abs(bal)}</span>;
}

export default Balance;