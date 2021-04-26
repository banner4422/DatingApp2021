import React, { useState } from 'react';
import './adminUsersChild.css'
import { useHistory, Link } from 'react-router-dom';

const AdminUsersChild = props => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // delete user
    const DELETE = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/admiDelete?theirID=${props.id}`, {
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
        history.push(`/admin/users`)
        // when token is implement we'll use window.location.reload() instead
    };

    return (
    <li className='adminUser'>
        <div className='adminUser-info'>
        {loading}
        <h2>UserID: {props.id}</h2>
        <h3>First Name: {props.first_name} </h3>
        <h3>Last Name: {props.last_name} </h3>
        <h3>Age: {props.age} </h3>
        <h3>Email: {props.email}</h3>
        <h3>Password: {props.password}</h3>
        <h3>Gender: {props.gender}</h3>
        <h3>Interested in {props.gender_interest}</h3>
        <h3>They seek matches between the age of {props.age_interest_min} to {props.age_interest_max}</h3>
        <h3>They currently have {props.matches > 1 || props.matches === 0 ? `${props.matches} matches` : `${props.matches} match`} </h3>
        <h3>City: {props.city}</h3>
        <h3>Their hobbies are {props.interest}</h3>
        <h4>Description:</h4>
        <p>{props.description}</p>
        </div>
        <div className='adminUser-delete'>
        <Link to={`/user/edit/${props.id}`}>
              <button>Edit user info</button>
        </Link>
        </div>
        <div className='adminUser-delete'>
            <button onClick={DELETE}>Delete User</button>
        </div>
    </li>
    );
};

export default AdminUsersChild;