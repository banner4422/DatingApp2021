import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/Auth-context'
import './NavLinks.css';

{/*
exports a list of the nav links for use in the navigation header

NavLink is a special version of the <Link> that will add styling attributes to the rendered element when it matches the current URL.
Read more about NavLink here https://reactrouter.com/web/api/NavLink 

<Link> provides declarative, accessible navigation around your application.
with the to= attribute defining where the link needs to go to, down below is the routes as defined in ../../../App
Read more about Link here https://reactrouter.com/web/api/Link 

*/}
const NavLinks = props => {
    // get the Authorization context, or in other words, the user logged in
    // useContext provides a way to pass data through the component tree without having to pass props down manually at every level.
    // read more here https://reactjs.org/docs/hooks-reference.html#usecontext 
    const auth = useContext(AuthContext);

    return <ul className='nav-links'>
        {/* ! means if the value is not true */}
        {/* Values below are if the user is logged in and is NOT an admin */}
        {auth.isLoggedIn && !auth.is_admin && (
        <li>
            <NavLink to='/' exact>Matching</NavLink>
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
        {auth.isLoggedIn && auth.is_admin && (
        <li>
            <NavLink to='/admin/matches' exact>Matches</NavLink>
        </li>
        )}
        {/* If the user is not logged in */}
        {!auth.isLoggedIn && !auth.is_admin && (
        <li>
            <NavLink to='/auth' exact>Log in</NavLink>
        </li>
        )}
        {/* universal logout */}
        {auth.isLoggedIn && 
        <li>
            <button onClick={auth.logout}>
                Log out
            </button>
        </li>}
    </ul>
};

export default NavLinks;