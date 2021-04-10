{/*
import React from 'react';

import UserPasswordParent from '../components/UserPasswordParent';

const UsersPassword = () => {
  {/*user dummy for testing purposes
  const USERS = [
    {
      password: 'test123',
      RepeatPassword: 'test123'
    }
  ];

  return <UserPasswordParent items={USERS} />;
};

export default UsersPassword;

*/}

{/*

Only updates the password
Implemented because of the complications of server-side validation, because the route wouldn't validate a new password 
because it compares with the stored password in the database when validating

Edited out because of lack of time, the functionality is possible from the API through Postman.
  
*/}