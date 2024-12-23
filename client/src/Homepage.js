import React from 'react';
import {useGetCurrentUser} from "./hooks/useGetCurrentUser";
import {UserWidget} from "./components/userWidget/userWidget";

function Homepage() {
   const { user } = useGetCurrentUser()

  return (
    <div>
      {user && <UserWidget user={user}/>}
    </div>
  );
}

export default Homepage;
