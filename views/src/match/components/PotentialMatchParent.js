import React from 'react';
import PotentialMatch from './PotentialMatch';
import './PotentialMatchParent.css'

{/*
exports the potential match for the matching feature

This file is a component that gets used by ../pages/Matching.js, and uses ./PotentialMatch.js
Like ./PotentialMatch.js, this file is a component.
Components let you split the UI into independent, **reusable** pieces, and think about each piece in isolation.
Conceptually, components are like JavaScript functions. 
They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
Read more here https://reactjs.org/docs/components-and-props.html
or here https://www.w3schools.com/react/react_props.asp 

The difference between this file and ./PotentialMatch.js is that ./PotentialMatch.js renders the individual user
Whereas this file takes ./PotentialMatch.js and renders for each user that exists, with the .map() function

So in this file you define the user data for each user, that will be used by ./PotentialMatch.js
(remember you need to define a key in React https://reactjs.org/docs/lists-and-keys.html#basic-list-component)
*/}
const PotentialMatchParent = props => {
    if (props.items.length === 0) {
        return <h2>No users found.</h2>
    }
    return (
    <ul className='poten-list'>
        {props.items.map(user => (
        <PotentialMatch 
        key={user.id} 
        id={user.id} 
        first_name={user.first_name}
        last_name={user.last_name}
        city={user.city}
        age={user.age}
        gender={user.gender}
        gender_interest={user.gender_interest}
        interest={user.interest}
        description={user.description} 
        />
        ))}
    </ul>);
};

export default PotentialMatchParent;