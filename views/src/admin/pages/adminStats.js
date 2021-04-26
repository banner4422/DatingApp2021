import React, {useEffect, useState} from 'react';
import './adminStats.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'

const AdminStats = () => {
    const [loading, setLoading] = useState(false);
    const [userCount, setUserCount] = useState('');
    const [adminCount, setAdminCount] = useState('');
    const [matchCount, setMatchCount] = useState('');

    // GET CountTinderUsers
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/getCountUsers');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setUserCount(results[0].value);
                setAdminCount(results[1].value);
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
    if (loading) {
        return (
        <React.Fragment>
        <div className='center'>
            <h1>Loading</h1>
            </div>
            <div className='center'>
          <img src={loadingGIF} alt="loading..." />
          </div>
        </React.Fragment>
        )
      }

    return <div className='adminStats'>
        <h2>Statistics</h2>
        <p>The amount of dating app users that are signed up: {userCount}</p>
        <p>The amount of dating app admins: {adminCount}</p>
        <p>The amount of matches: {matchCount}</p>
    </div>
};

export default AdminStats;