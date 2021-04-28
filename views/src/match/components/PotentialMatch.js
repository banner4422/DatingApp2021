import React, { useContext } from 'react';
import { AuthContext } from '../../shared/context/Auth-context';
import './PotentialMatch.css'

{/*
For the matching feature
Like/dislikes can only be observed through the browser's console, no visual indication of a like/dislike implemented

This file is a component that gets used by ./PotentialMatchParent.js.
Components let you split the UI into independent, **reusable** pieces, and think about each piece in isolation.
Conceptually, components are like JavaScript functions. 
They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
Read more here https://reactjs.org/docs/components-and-props.html
*/}
const PotentialMatch = props => {
    // get the Authorization context, or in other words, the user logged in
    // useContext provides a way to pass data through the component tree without having to pass props down manually at every level.
    // read more here https://reactjs.org/docs/hooks-reference.html#usecontext 
    const auth = useContext(AuthContext);

    // like function, that posts the like for the user
    // it's used by a button below
    const Like = async event => {
        // avoids refreshing the page when it's posting
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault 
        event.preventDefault();
        try {
          const response = await fetch('http://localhost:' + process.env.REACT_APP_backendPort +`/api/match/likes/${props.id}`, { //props.id is the user being liked
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        // take the userID from the user who is logged in
                      likeUser: auth.userID
                    })
                });
                // converts the post data to json
                const responseData = await response.json();
                // checking if the post request was succesfully received
                console.log(responseData)
                // throw error if the like wasn't received by the server, perhaps cuz of formatting issues
                if (!response.ok) {
                throw new Error(responseData.message);
                }
                // catch error if connection with fetch wasn't possible
        } catch (err) {}
      };

    // same notes as the like function above
    const Dislike = async event => {
    event.preventDefault();
    try {
        const response = await fetch('http://localhost:' + process.env.REACT_APP_backendPort +`/api/match/dislikes/${props.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    dislikeUser: auth.userID
                })
            });
            const responseData = await response.json();
            console.log(responseData)
            if (!response.ok) {
            throw new Error(responseData.message);
            }
    } catch (err) {}
    };
    // read about props at the start of the file
      return (
    <li className='poten'>
        <div className='poten-info'>
        <h1>Match with a user!</h1>
        <h2>{props.first_name} {props.last_name}</h2>
        <h2>Is {props.age} and from {props.city}</h2>
        <h2>The person is interested in {props.gender_interest} and loves {props.interest}</h2>
        <h3>Description:</h3>
        <p>{props.description}</p>
        </div>
        <div className='poten-button'>
            <button onClick={Like}>Like</button>
            <button onClick={Dislike}>Dislike</button>
        </div>
    </li>
    );
};

export default PotentialMatch;