/*

General flow for our actions
- Import dependencies and actions defs from types.js
- Use axios to make HTTPRequests within certain actions 
- dispatch to send actions to our reducers

*/

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import
{
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";


// User Registration 
export const registerUser = (userData, history) => dispatch => {
    axios
    .post( "/routes/api/users/register", userData )
    .then( res => history.push("/login"))
    .catch( err => dispatch(
        {
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

// get user token LOGIN
export const loginUser = userData => dispatch =>
{
    axios 
    .post( "/routes/api/users/register", userData ) 
    .then( res => {

        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data
        })
        );
};

// Set logged-in User
export const setCurrentUser = decoded => 
{
    return 
    {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading 
export const setUserLoading = () => 
{
    return 
    {
        type: USER_LOADING
    };
};

// Log User Out
export const logoutUser = () => dispatch => 
{
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set is Authenticated to F
    dispatch(setCurrentUser({})); 
};