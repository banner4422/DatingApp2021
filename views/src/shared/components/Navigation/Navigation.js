import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import './Navigation.css';
import Header from './Header';
import NavLinks from './NavLinks';
import { AuthContext } from '../../context/Auth-context'

{/*
exports the navigation header

Header is used to wrap the Link and NavLinks
Read about both Link and NavLinks in ./NavLinks

This navigation header file is used in ../../../App.js

*/}
const Navigation = props => {

    const auth = useContext(AuthContext);

    return <Header>
        <h1 className='navigation-title'>
            <Link to={auth.is_admin ? '/admin/stats' : `/homepage/${auth.userID}`}>Dating App (MVP)</Link>
        </h1>
        <nav className='navigation-header-nav'>
            <NavLinks />
        </nav>
    </Header>
};

export default Navigation;