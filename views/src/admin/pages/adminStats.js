import React, {useEffect, useState} from 'react';
import './AdminStats.css'

const AdminStats = () => {
    const [loading, setLoading] = useState(false);
    const [userCount, setUserCount] = useState('');
    const [matchCount, setMatchCount] = useState('');

    // GET CountTinderUsers
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/getCountTinderUsers');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setUserCount(results[0].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false);
        };
        GET();
    }, []);

    // GET CountMatches
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/getCountMatches');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setMatchCount(results[0].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false);
        };
        GET();
    }, []);

    return <div className='adminStats'>
        {loading}
        <h2>Statistics</h2>
        <p>The amount of users that are signed up: {userCount}</p>
        <p>The amount of matches: {matchCount}</p>
    </div>
};

export default AdminStats;