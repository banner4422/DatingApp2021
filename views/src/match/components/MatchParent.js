import React from 'react';
import Match from './Match';
import './MatchParent.css'

{/*exports a list of a user's matches, with the child being in Match.js*/}

{/*
This file is a component that gets used by ../pages/Matches.js, and uses ./Match.js
Like ./Match.js, this file is a component.
Components let you split the UI into independent, **reusable** pieces, and think about each piece in isolation.
Conceptually, components are like JavaScript functions. 
They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
Read more here https://reactjs.org/docs/components-and-props.html
or here https://www.w3schools.com/react/react_props.asp 

The difference between this file and ./Match.js is that ./Match.js renders the individual user
Whereas this file takes ./Match.js and renders for each match that exists, with the .map() function

So in this file you define the match data for each user, that will be used by ./Match.js
(remember you need to define a key in React https://reactjs.org/docs/lists-and-keys.html#basic-list-component)

*/}

const MatchParent = props => {
    if (props.items.length === 0) {
        return <h2>No Matches found.</h2>
    }
    return (
    <ul className='match-list'>
        {props.items.map(match => (
        <Match 
        key={match.id} 
        id={match.id} 
        name={match.first_name + ' ' + match.last_name} 
        age={match.age}
        gender={match.gender}
        gender_interest={match.gender_interest}
        city={match.city} 
        description={match.description} 
        />
        ))}
    </ul>);
};

export default MatchParent;