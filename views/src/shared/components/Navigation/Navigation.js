import React from 'react';
import { Link } from 'react-router-dom'
import './Navigation.css';
import Header from './Header';
import NavLinks from './NavLinks';

{/*
exports the navigation header

Header is used to wrap the Link and NavLinks
Read about both Link and NavLinks in ./NavLinks

This navigation header file is used in ../../../App.js

*/}
const Navigation = props => {
    return <Header>
        <h1 className='navigation-title'>
            <Link to='/'>Dating App (MVP)</Link>
        </h1>
        <nav className='navigation-header-nav'>
            <NavLinks />
        </nav>
    </Header>
};

export default Navigation;