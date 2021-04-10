import React from 'react';
import { Link } from 'react-router-dom';

import './User.css';

{/*
exports user component for the logged in and it's layout

This file is a component that gets used by ./UserParent.js.
Components let you split the UI into independent, **reusable** pieces, and think about each piece in isolation.
Conceptually, components are like JavaScript functions. 
They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
Read more here https://reactjs.org/docs/components-and-props.html

<Link> provides declarative, accessible navigation around your application.
with the to= attribute defining where the link needs to go to, down below is the routes as defined in ../../../App
Read more about Link here https://reactrouter.com/web/api/Link 

*/}
const User = props => {
  return (
    <li className="user">
          <div className="user-info">
            <h2>User: {props.username}</h2>
            <h2>Age: {props.age}</h2>
            <h2>Gender: {props.gender}</h2>
            <h2>Interested in: {props.genderInterest}</h2>
            <h2>Location: {props.location}</h2>
            <h2>Description: {props.description}</h2>
          </div>
          <div>
              <Link to={`/user/edit/${props.id}`}>
              <button>Edit user information</button>
              </Link>
          </div>
    </li>
  );
};

export default User;
