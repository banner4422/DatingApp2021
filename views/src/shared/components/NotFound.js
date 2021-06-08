import React from 'react';
import './NotFound.css'

const NotFound = () => {

    return <div className='adminStats'>
        <h1>Not Found!</h1>
        <h2>There was no results for the following specified URL:</h2>
        <h3>{window.location.href}</h3>
    </div>
};

export default NotFound;