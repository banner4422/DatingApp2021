import React, { useState } from 'react';
import './Match.css'
import { useParams, useHistory } from 'react-router-dom';
{/*

*/}
const Match = props => {
    const [loading, setLoading] = useState(false);
    const userID = useParams().userID;
    const history = useHistory();

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
            history.push(`/matches/${userID}`)
            // when token is implement we'll use window.location.reload() instead
        };

    return (
    <li className='match'>
        <div className='match-info'>
        {loading}
        <h2>{props.name}, {props.age}</h2>
        <h3>{props.gender}</h3>
        <h3>Interested in {props.gender_interest}</h3>
        <h3>{props.city}</h3>
        <p>{props.description}</p>
        </div>
        <div className='match-delete'>
            <button onClick={DELETE}>Delete Match</button>
        </div>
    </li>
    );
};

export default Match;