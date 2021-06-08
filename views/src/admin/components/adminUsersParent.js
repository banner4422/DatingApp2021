import React from 'react';
import AdminUsersChild from './adminUsersChild';
import './adminUsersParent.css'

const AdminUsersParent = props => {
    if (props.items.length === 0) {
        return <h2>No Users found.</h2>
    }
    return (
    <ul className='adminUser-list'>
        {props.items.map(user => (
        <AdminUsersChild 
        key={user.id} 
        id={user.id} 
        first_name={user.first_name}
        last_name={user.last_name} 
        age={user.age}
        email={user.email}
        password={user.password}
        gender={user.gender}
        gender_interest={user.gender_interest}
        age_interest_min={user.age_interest_min}
        age_interest_max={user.age_interest_max}
        city={user.city}
        interest={user.interest}
        description={user.description}
        matches={user.matches}
        />
        ))}
    </ul>);
};

export default AdminUsersParent;