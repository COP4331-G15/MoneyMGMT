import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';

function Token() {
   const { userId, token } = useParams();
   const [status, setStatus] = useState({loading: true});

   useEffect( () => {
      let loadData = async() => {
         const response = await fetch(`/api/users/confirmEmail`, {
            method: 'POST',
            body: JSON.stringify({userId: userId, token: token}),
            headers: {
               'Content-Type': 'application/json'
            }
         });

         const result = await response.json();
         console.log(result);

         if (response.status !== 200 || result.error) {
            setStatus({error: result.error || "Unknown error"});
            return;
         }
         setStatus({});
      }

      loadData();
   }, []);

   let content;

   if (status.loading) {
      content = "Loading";
   }
   else if (status.error) {
      content = "Error: "+status.error;
   }
   else {
      content = (
         <div>
            <h3 className="lead text-muted text-center">Confirmed</h3>
            Go to <Link to="/login">Login</Link>
         </div>
      );
   }

   return (
      <div>
         {content}
      </div>
   );
}

export default Token;;
