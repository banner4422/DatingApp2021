import React, { useEffect, useState } from 'react';
import MatchParent from '../components/MatchParent';
import { useParams } from 'react-router-dom';
import loadingGIF from '../../shared/components/loadingGIF.gif'

{/*
This file can only be accessed with authorised access through being logged in, as defined in ../../App
*/}
{/*
shows a list of a user's matches

This file is for one HTML render page that gets used by ../../App.js, and uses ./MatchParent.js
How paging works can be read in the app.js file

Besides React, this file specifically make use of useState and useEffect, which are both hooks (https://reactjs.org/docs/hooks-state.html#whats-a-hook)
Hooks basically makes it possible to use various React features without writing a class specifying what features to use

useState() & setState() is where you store property values that belongs to the component.
When the state object changes, the component re-renders.
The comments below explains for each useState case

useEffect() - By using this Hook, you tell React that your component needs to do something after render. 
React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates
So e.g. the useEffect() below fetches the matches for the user
If the user deletes a match, it re-renders the page (because of useState()) and then useEffect fetches once again

*/}
const Matches = () => {
    // Manages the state of fetching the API data, very important.
    // Because if it wasn't implemented, the page would fail to render data because it looks after the data instantly
    // which would end up as undefined because the data isn't loaded yet
    // when manging the state of loading the data, it delays rendering elements till they are loaded and defined in (setUserload)
    const [loading, setLoading] = useState(false);
    // the state of loaded matches
    // setUserLoad is the matches fetched by the API below
    // userLoad contains the fetched data
    const [userLoad, setUserLoad] = useState();

    // useParams()returns an object of key/value pairs of URL parameters.
    // so this object takes the userID of the logged in user, and uses it to fetch their matches
    const userID = useParams().userID;

    // fetching a user's matches 
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

    // if a user doesn't have matches (userLoad is empty of objects)
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

    if (!userLoad) {
        return (<div className='center'>
          <h2>You don't have any matches yet.</h2>
        </div>)
      }
    // if the user does have matches
    return (
    // Fragments let you group a list of children without adding extra nodes to the DOM
    // it would not render without wrapping them into a <React.Fragment>
    // read more here https://reactjs.org/docs/fragments.html
        <React.Fragment>
    {/* if loading is false and userLoad (matches) exist, then render the matches with the MatchParent imported from  ./MatchParent.js*/}
    {/* if loading wasn't implemented like this, it would see userLoad as empty*/}
    {!loading && userLoad && <MatchParent items={userLoad} />}
    </React.Fragment>
    );
};
// exports the file for use in ../../App.js
export default Matches;