import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/Auth-context'
import './NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext);
    const history = useHistory();

    const LOGOUT = async () => {
        auth.logout();
        history.push(`/`)
    };

    return <ul className='nav-links'>
        {/* Values below are if the user is logged in and is NOT an admin */}
        {auth.isLoggedIn && !auth.is_admin && (
        <li>
            <NavLink to={`/matching/${auth.userID}`} exact>Matching</NavLink>
        </li>
        )}
        {auth.isLoggedIn && !auth.is_admin && (
        <li>
            <NavLink to={`/user/${auth.userID}`} exact>My Profile</NavLink>
        </li>
        )}
        {auth.isLoggedIn && !auth.is_admin && (
        <li>
            <NavLink to={`/matches/${auth.userID}`} exact>Matches</NavLink>
        </li>
        )}
        {/* If the user is logged in and IS an admin */}
        {auth.isLoggedIn && auth.is_admin && (
        <li>
            <NavLink to='/admin/stats' exact>Statistics</NavLink>
        </li>
        )}
        {auth.isLoggedIn && auth.is_admin && (
        <li>
            <NavLink to='/admin/users' exact>Users</NavLink>
        </li>
        )}
        {/* If the user is not logged in */}
        {!auth.isLoggedIn && !auth.is_admin && (
        <li>
            <NavLink to='/' exact>Log in</NavLink>
        </li>
        )}
        {/* universal logout */}
        {auth.isLoggedIn && 
        <li>
            <button onClick={LOGOUT}>
                Log out
            </button>
        </li>}
    </ul>
};

export default NavLinks;