import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import './Navigation.css';
import Header from './Header';
import NavLinks from './NavLinks';
import { AuthContext } from '../../context/Auth-context'

const Navigation = props => {

    const auth = useContext(AuthContext);
    if (!auth.userID) {
        return <Header>
        <h1 className='navigation-title'>
            <Link to='/'>Dating App (MVP)</Link>
        </h1>
        <nav className='navigation-header-nav'>
            <NavLinks />
        </nav>
    </Header>
    } else {
    return <Header>
        <h1 className='navigation-title'>
            <Link to={auth.is_admin ? '/admin/stats' : `/homepage/${auth.userID}`}>Dating App (MVP)</Link>
        </h1>
        <nav className='navigation-header-nav'>
            <NavLinks />
        </nav>
    </Header>
    }
};

export default Navigation;