import React from 'react';
import './Header.css';

{/*
a header component, which will be wrapped in the file used and be rendered by the props.children
read more about components and props here https://reactjs.org/docs/components-and-props.html 

This file will be used by ./Navigation where it's wrapped between header objects

*/}
const Header = props => {
    return <header className='mainHeader'>
        {props.children}
    </header>
};

export default Header