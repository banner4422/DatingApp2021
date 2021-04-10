import React from 'react';
import './Match.css'
{/*
a user's match description in matches
Deleting match functionality not implemented yet.

This file is a component that gets used by ./MatchParent.js.
Components let you split the UI into independent, **reusable** pieces, and think about each piece in isolation.
Conceptually, components are like JavaScript functions. 
They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
Read more here https://reactjs.org/docs/components-and-props.html
*/}
const Match = props => {
    {/* 
    
    */}
    return (
    <li className='match'>
        <div className='match-info'>
        <h2>{props.username}, {props.age}</h2>
        <h3>{props.gender}</h3>
        <h3>{props.location}</h3>
        <p>{props.description}</p>
        </div>
        <div className='match-delete'>
            <button>Delete Match</button>
        </div>
    </li>
    );
};

export default Match;