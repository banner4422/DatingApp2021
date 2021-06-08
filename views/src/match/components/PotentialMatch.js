import React, { useContext } from 'react';
import { AuthContext } from '../../shared/context/Auth-context';
import './PotentialMatch.css'

const PotentialMatch = props => {
    // get the Authorization context, or in other words, the user logged in
    // useContext provides a way to pass data through the component tree without having to pass props down manually at every level.
    // read more here https://reactjs.org/docs/hooks-reference.html#usecontext 
    const auth = useContext(AuthContext);

    // like function, that HTTP posts the like for the user
    // it's used by a button below
    const Like = async event => {
        // avoids refreshing the page when it's posting
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault 
        event.preventDefault();
        try {
          const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/like`, { //props.id is the user being liked
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                      id1: props.id,
                      id2: auth.userID
                    })
                });
                // converts the post data to json
                const responseData = await response.json();
                
                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                // the HTTP post stores the like if it doesn't already exists, and then returns rows where both the props.id and auth.userID are present
                // if it's more than 1 row (exactly 2 rows), then the two users have liked each other and then it's a match
                if (responseData.length > 1) {
                    try {
                        Match(props.id, auth.userID);
                    window.alert(`You have a match!\nYou matched with ${props.first_name} ${props.last_name} from ${props.city}!\nCheck your match's info on the match page`)
                    } catch {
                        console.log(`Match error between userID: ${props.id} and userID: ${auth.userID}`)
                    }
                } else {
                    // perhaps pagination next page?
                    console.log(`Like sent to userID: ${props.id} by userID: ${auth.userID}`)
                    // console logging 
                }
                // catch error if connection with fetch wasn't possible
        } catch (err) {}
      };

    // HTTP post dislike
    const Dislike = async event => {
    event.preventDefault();
    try {
        const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    id1: props.id,
                    id2: auth.userID
                })
            });
            const responseData = await response.json();
            console.log(responseData)
            if (!response.ok) {
                throw new Error(responseData.message);
            }
    } catch (err) {}
    };

    // posts the match if the two users has liked each other
    const Match = async (userA, userB) => {
        try {
            const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/postMatch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        id1: userA,
                        id2: userB
                    })
                });
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
        } catch (err) {}
        };

      return (
    <li className='poten'>
        <div className='poten-info'>
        <h1>Match with a user!</h1>
        <h2>{props.first_name} {props.last_name}</h2>
        <h2>{props.gender}</h2>
        <h2>Is {props.age} years old and from {props.city}</h2>
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