import {useEffect} from 'react';

function useDarkMode() {
	useEffect(() => {
		document.body.classList.add("dark");
		return function cleanup() {
			document.body.classList.remove("dark");
		};
	}, []);
}

export default useDarkMode;