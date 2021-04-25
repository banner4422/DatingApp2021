import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import Notification from '../../shared/components/Notification'

import './UsersEdit.css'

{/*
The user edit page, where the logged in user can edit their information

It's used by ../../App.js

Besides React, this file specifically make use of useState and useEffect, which are both hooks (https://reactjs.org/docs/hooks-state.html#whats-a-hook)
Hooks basically makes it possible to use various React features without writing a class specifying what features to use

useState() & setState() is where you store property values that belongs to the component.
When the state object changes, the component re-renders.
The comments below explains for each useState case

useEffect() - By using this Hook, you tell React that your component needs to do something after render. 
React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates
So e.g. the useEffect() in ../../match/pages/Matches fetches the matches for the user
If the user deletes a match, it re-renders the page (because of useState()) and then useEffect fetches once again

*/}

const UsersEdit = () => {
  // get the Authorization context, or in other words, the user logged in
    // useContext provides a way to pass data through the component tree without having to pass props down manually at every level.
    // read more here https://reactjs.org/docs/hooks-reference.html#usecontext 
  const auth = useContext(AuthContext);

  // Manages the state of fetching the API data, very important.
  // Because if it wasn't implemented, the page would fail to render data because it looks after the data instantly
  // which would end up as undefined because the data isn't loaded yet
  // when manging the state of loading the data, it delays rendering elements till they are loaded and defined in (setUserload)
  const [loading, setLoading] = useState(false);

  // the state of the loaded logged in user, loads their information
  // setUserLoad is the user information fetched by the API below
  // userLoad contains the fetched data
  const [userLoad, setUserLoad] = useState();

  // The useHistory hook gives you access to the history instance that you may use to navigate.
  // it's used to redirect to a page after an action e.g. redirecting to the login/signup page after deleting the user
  // https://reactrouter.com/web/api/Hooks/usehistory
  const history = useHistory();

  // useStates for the POST request
  // it takes what the user writes in the inputs and set the state for what's written in the input
  // then e.g. the username can be used in the POST request where its value is what the user wrote
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [genderInterest, setGenderInterest] = useState('Female');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // it should've been possible to fetch the already existing data and just change in that,
  // but i couldn't make it work when i worked on this previously
  // may be possible to do now

  // useParams()returns an object of key/value pairs of URL parameters.
  // so this object takes the userID of the logged in user, and uses it to fetch their information
  const userID = useParams().userID;

  //Manages the state of the notification
  //Read more about notifcations in ../../shared/components/Notification
  const [showNoti, setNoti] = useState(false);
    const openNoti = () => setNoti(true);
    const closeNoti = () => setNoti(false);
    // delete user function
    // used by the button below
    const deleteUser = async () => {
        setNoti(false);
        // we are now sending data, so setLoading = true
        setLoading(true);
        try {
          const response = await fetch('http://localhost:' + process.env.REACT_APP_backendPort +`/api/user/${userID}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                });
                const responseData = await response.json();
                if (!response.ok) {
                  // if connection was made with the server, but it couldn't deleted cuz of perhaps an invalid userID
                throw new Error(responseData.message);
                }
                // we are now done sending data, so setLoading = false
                setLoading(false);
                // redirect the user to the login/signup page
                // may need to assign that they're logged out through the Auth-context
                history.push(`/auth`)
                // catch error if it couldn't connect to the server for some reason
        } catch (err) {}
    };

  //fetches logged in user
  useEffect (() => {
    const GET = async () => {
        // we are now fetching data, so setLoading = true
        setLoading(true);
        try {
            const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/TinderUserGetFullByID?id=${userID}`);
            const results = await response.json();
            if(!response.ok) {
              // if connection was made with the server, but it couldn't fetch the user data cuz of perhaps an invalid userID ????
                throw new Error(results.message);
            }
            // sets the userLoad state to the fetched data of the logged in user
            setUserLoad(results);
        } catch (err) {
            // catch error if it couldn't connect to the server for some reason
            console.log(err)
        }
        // we are now done fetching data, so setLoading = false
        setLoading(false)
    };
    // we call our function
    GET();
    // second array argument are explained here https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects 
}, [userID]);

//updates user being logged in
  const userUpdateInfo = async event => {
    // avoids refreshing the page when it's patching
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault 
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:' + process.env.REACT_APP_backendPort +`/api/user/info/${userID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                  username,
                    age,
                    gender,
                    genderInterest,
                    location,
                    description
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                            // if connection was made with the server, but it couldn't fetch the user data cuz of perhaps an invalid userID ????
            throw new Error(responseData.message);
            }
            // we are now done patching data, so setLoading = false
            setLoading(false);
            // redirect the user to the user info page, where the updated info should be fetched
            history.push(`/user/${auth.userID}`)
    // catch error if it couldn't connect to the server for some reason
    } catch (err) {}
  };
  // If the user couldn't be loaded for some reason
  if (!userLoad) {
    return (<div className='center'>
      <h2>Could not find user, ERROR</h2>
    </div>)
  }

  return (
    <React.Fragment>
      {/* 
      Notification popup if the user wants to delete their user or not
      Scuffed notification cuz the rest of the update info inputs are further down the page LOL
      Perhaps it should've managed the state of if the user wants to delete their account or not
      an if statement with the two returns?
       */}
      <Notification 
            show={showNoti}
            header={userLoad.username}
            contentClass='user-edit__notification-content'
            footerClass='user-edit__notification-actions'
            footer={
                <div>
            <button onClick={closeNoti}>No</button>
            <button onClick={deleteUser}>Yes</button>
            </div>}
            >
                <div className='.user-edit__notification-content2'>
                    <h2>Delete your user?</h2>
                    <p>Are you sure that you want to delete your user?</p>
                </div>
        </Notification>
      {/* When the user info is done loading and the user info is loaded */}
      {!loading && userLoad && (
        <div className='user-edit-info'>
        <form onSubmit={userUpdateInfo}>
          <div>
            <label for='username'>Username:</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='username' name='username' value={username} onChange={event => setUsername(event.target.value)}></input><br></br>
            </div>
            <div>
            <label for='age'>Age:</label><br></br>
            <input type='text' id='age' name='age' value={age} onChange={event => setAge(event.target.value)}></input><br></br>
            </div>

            <div>
            <label for='gender'>Gender:</label><br></br>
            <label for='female'>Female</label>
            <input type='radio' id='female' name='gender' checked={gender === 'Female'} value='Female' onChange={event => setGender(event.target.value)}></input><br></br>
            <label for='male'>Male</label>
            <input type='radio' id='male' name='gender' checked={gender === 'Male'} value='Male' onChange={event => setGender(event.target.value)}></input><br></br>
            </div>

            <div>
            <label for='genderInterest'>Interested in:</label><br></br>
            <label for='femaleInterest'>Females</label>
            <input type='radio' id='femaleInterest' name='genderInterest' value='Female' onChange={event => setGenderInterest(event.target.value)}></input><br></br>
            <label for='maleInterest'>Males</label>
            <input type='radio' id='maleInterest' name='genderInterest' value='Male' onChange={event => setGenderInterest(event.target.value)}></input><br></br>
            <label for='both'>Both</label>
            <input type='radio' id='both' name='genderInterest' value='Both' onChange={event => setGenderInterest(event.target.value)}></input><br></br>
            </div>


            <div>
            <label for='location'>Location:</label><br></br>
            <input type='text' id='location' name='location' value={location} onChange={event => setLocation(event.target.value)}></input><br></br>
            </div>

            <div>
            <label for='description'>Description:</label><br></br>
            <input type='text' id='description' name='description' value={description} onChange={event => setDescription(event.target.value)}></input><br></br><br></br>
            </div>

            <div>
            <input type="submit" value='Save user changes'></input><br></br><br></br>
            </div>
            <div>
            {/* A button that links back to the user info*/}
            <Link to={`/user/${auth.userID}`}>
              <button>Go back with no changes</button>
            </Link>
            </div>
            {/* Button for if the user wants to delete their account*/}
            <div>
              <button onClick={openNoti}>Delete user</button>
            </div>
        </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UsersEdit;
