import React, { useState,  useEffect} from 'react';
import { useParams} from 'react-router-dom';
import './Homepage.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'

const Homepage = () => {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [userCount, setUserCount] = useState('');
    const [matchCount, setMatchCount] = useState('');
    
    const userID = useParams().userID;

    //get user who just logged in
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/TinderUserGetFullByID?id=${userID}`);
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                console.log(results)
                setFullName(results[1].value + ' ' + results[2].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    // get the amount of signed up users
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
    return <div className='Users'>
      <div>
      <h2> 🎉 Welcome Back 🎉 </h2>
      <h1>{fullName}!</h1>
      <h2> ❤️ There are currently {userCount} users signed up and ready to match! ❤️</h2>
      <h2>Already {matchCount} matches has been made! 😍😍</h2>
      </div>
      <div>
      </div>
  </div>

}





export default Homepage;