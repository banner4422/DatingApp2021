import React, { useState } from 'react';
import './Match.css'
import { useParams } from 'react-router-dom';
{/*

*/}
const Match = props => {
    const [loading, setLoading] = useState(false);
    // using the user id from url
    const userID = useParams().userID;

        // delete match HTTP
        const DELETE = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/DeleteMatch?yourID=${userID}&theirID=${props.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                });
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
            } catch (err) {
                console.log(err)
            }
            setLoading(false);
            window.location.reload();
        };

    return (
    <li className='match'>
        <div className='match-info'>
        {loading}
        <h2>{props.name}, {props.age}</h2>
        <h3>{props.gender}</h3>
        <h3>Interested in {props.gender_Interest}</h3>
        <h3>{props.city}</h3>
        <h3>Their hobbies are {props.interest}</h3>
        <h4>Description:</h4>
        <p>{props.description}</p>
        </div>
        <div className='match-delete'>
            <button onClick={DELETE}>Delete Match</button>
        </div>
    </li>
    );
};

export default Match;