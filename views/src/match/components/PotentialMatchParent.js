import React from 'react';
import PotentialMatch from './PotentialMatch';
import './PotentialMatchParent.css'

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