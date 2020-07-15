/*

Used to set and delete the Auth header from axios requests depending 
on if a user is logged in or not

*/

import axios from "axios";

const setAuthToken = token => {
    if (token)
    {
        // Apply token to ever logged in request
        axios.defaults.headers.common["Authorization"] = token;
    }
    else
    {
        // Wipe authorization header
        delete axios.defaults.headers.common["Authorization"];
    }
};

export default setAuthToken;