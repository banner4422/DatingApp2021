import React, { useEffect, useState, useContext } from 'react';
import MatchParent from '../components/MatchParent';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import loadingGIF from '../../shared/components/loadingGIF.gif'

const Matches = () => {
    const [loading, setLoading] = useState(false);
    // setUserLoad is the matches fetched by the API below
    // userLoad contains the fetched data
    const [userLoad, setUserLoad] = useState();

    // useParams()returns an object of key/value pairs of URL parameters.
    // so this object takes the userID of the logged in user, and uses it to fetch their matches
    const userID = useParams().userID;
    const auth = useContext(AuthContext)

    // fetches a user's matches 
    useEffect (() => {
        const GET = async () => {
            // we are now fetching data, so setLoading = true
            setLoading(true);
            try {
                // needs to be updated with new HTTP
                const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/currentMatches?userId=${userID}`);
                // convert the fetched data to json
                const results = await response.json();
                if(!response.ok) {
                    // error handles if the data doesn't exist
                    throw new Error(results.message);
                }
                // we set the state of matches to the fetched data
                setUserLoad(results);
            } catch (err) {
                // if the fetch wasn't possible at all
                console.log(err)
            }
            // we are now done fetching data, so setLoading = false
            setLoading(false)
        };
        // we call our function
        GET();
        // second array argument are explained here https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects 
    }, [userID]);

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

    if(!auth.is_admin) {
        if(userID !== auth.userID.toString()) {
            return (
                <React.Fragment>
                <div className='center'>
                    <h1>You are not authorised to access this page.</h1>
                    </div>
                </React.Fragment>
                )
            }
    }

    // if a user doesn't have matches (userLoad is empty of objects)
    if (!userLoad) {
        return (<div className='center'>
          <h2>You don't have any matches yet.</h2>
        </div>)
    }

    // if the user does have matches
    return (
        <React.Fragment>
    {/* if loading is false and userLoad (matches) exist, then render the matches with the MatchParent imported from  ./MatchParent.js*/}
    {/* if loading wasn't implemented like this, it would see userLoad as empty*/}
    {!loading && userLoad && <MatchParent items={userLoad} />}
    </React.Fragment>
    );
};

export default Matches;