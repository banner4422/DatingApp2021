import React from 'react';

import User from './User';
import './UserParent.css';

{/* 
This file is a component that gets used by ../pages/Users.js, and uses ./User.js
Like ./User.js, this file is a component.
Components let you split the UI into independent, **reusable** pieces, and think about each piece in isolation.
Conceptually, components are like JavaScript functions. 
They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
Read more here https://reactjs.org/docs/components-and-props.html
or here https://www.w3schools.com/react/react_props.asp 

The difference between this file and ./User.js is that ./User.js renders the individual user
Whereas this file takes ./User.js and renders for each match that exists, with the .map() function
Tho for ../pages/Users.js, the API route only renders the logged in user by the id from the AuthContext

So in this file you define the user data for each user, that will be used by ./user.js
(remember you need to define a key in React https://reactjs.org/docs/lists-and-keys.html#basic-list-component)
*/}

const UserParent = props => {
  {/*error if the database doesn't export the user information for some reason*/}
  if (props.items.length === 0) {
    return (
      <div className="center">
          <h2>Error, can't load your user information.</h2>
      </div>
    );
  }
{/*renders the user information*/}
  return (
    <ul className="user-list">
      {props.items.map(user => (
        <User
          key={user.id}
          id={user.id}
          username={user.username}
          age={user.age}
          gender={user.gender}
          genderInterest={user.genderInterest}
          location={user.location}
          description={user.description}
        />
      ))}
    </ul>
  );
};

export default UserParent;
