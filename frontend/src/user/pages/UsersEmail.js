 {/*
import React from 'react';

import UserEmailParent from '../components/UserEmailParent';

const UsersEmail = () => {
  {/*user dummy for testing purposes
  const USERS = [
    {
      email: 'testing@test.com',
      password: 'test123'
    }
  ];

  return <UserEmailParent items={USERS} />;
};

export default UsersEmail;
*/}

{/*

Only updates the email
Implemented because of the complications of server-side validation, because the route wouldn't validate a new email 
because it compares with the stored email in the database when validating

Edited out because of lack of time, the functionality is possible from the API through Postman.
  
*/}