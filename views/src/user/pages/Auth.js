import React, { useState, useContext, useEffect } from 'react';
import './Auth.css'
import { AuthContext } from '../../shared/context/Auth-context'
import { useHistory } from 'react-router-dom';

{/*
The login/signup page

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
const Auth = () => {
    // get the Authorization context, or in other words, the user logged in
    // useContext provides a way to pass data through the component tree without having to pass props down manually at every level.
    // read more here https://reactjs.org/docs/hooks-reference.html#usecontext 
    const auth = useContext(AuthContext)

    //sets state for if the user wants to login or not, used by the modeHandler below
    // further explanation for it's purpose below
    const [Login, setLogin] = useState(true);

    // Manages the state of fetching the API data, very important.
    // Because if it wasn't implemented, the page would fail to render data because it looks after the data instantly
    // which would end up as undefined because the data isn't loaded yet
    // when manging the state of loading the data, it delays rendering elements till they are loaded and defined in (setUserload)
    const [loading, setLoading] = useState(false);

    // useStates for the POST request
    // it takes what the user writes in the inputs and set the state for what's written in the input
    // then e.g. the username can be used in the POST request where its value is what the user wrote
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Female');
    const [genderInterest, setGenderInterest] = useState('Female');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [interest, setInterest] = useState('');
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');


    // Fetches data to be used for signing up
    // new Azure Functions implementation
    const [genderFetch, setGenderFetch] = useState('');
    const [genderInterestFetch, setGenderInterestFetch] = useState('');
    const [interestFetch, setinterestFetch] = useState('');

    // fetches the gender table from /api/getGenders, or ../../../../getGenders/index
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/getGenders');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setGenderFetch(results);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    // fetches the gender_Interest table from /api/getInterest, or ../../../../getInterest/index
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/getInterest');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setinterestFetch(results);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    // fetches the gender_Interest table from /api/getGenderInterest, or ../../../../getGenderInterest/index
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/getGenderInterest');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setGenderInterestFetch(results);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    const history = useHistory();

    // changes the mode, if the user wants to sign up or log in
    // if the user clicks login, it will only show Email and Password input fields
    // if the user clicks signup, it will show all input fields.
    const modeHandler = () => {
        setLogin(prevMode => !prevMode);
    };
    
    // login and signup POST function, used by the HTML form below
    const submission = async event => {
        // avoids refreshing the page when it's posting
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault 
        event.preventDefault();
        // we are now sending data, so setLoading = true
        setLoading(true);
        if (Login) {
            if (email.length < 1) {
                window.alert(`You need to write your email`)
                return
            }
            if (password.length < 1) {
                window.alert(`You need to write your password`)
                return
            }
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    //the email and password useStates from above
                    email: email,
                    password: password
                })
            });
            // converts the data to json
            const responseData = await response.json();
            if (!response.ok) {
                // throw error if the login wasn't successful, perhaps because the data didn't pass server-side validation
            throw new Error(responseData.message);
            }
            if (responseData.loginLogic[1].value === true) {
                setLoading(false);
                auth.adminLogin(responseData.loginLogic[0].value, responseData.token, responseData.loginLogic[1].value)
                history.push(`/admin/stats`)
            } else {
            // we are now done sending data, so setLoading = false
            setLoading(false);
            // log the user in with the userID from the responseData
            auth.login(responseData.loginLogic[0].value, responseData.token, responseData.loginLogic[1].value)
            history.push(`/homepage/${responseData.loginLogic[0].value}`)
        }
            } catch (err) {
                // catch error if it couldn't even connect to the API route for some reason
                setLoading(false);
                console.log(err)
            }
        } else {
            // if the user wants to signup
            if (ageMin > ageMax) {
                window.alert(`Your minimum age can't be higher than your maximum age`)
                return
            }
            // we need to add more validation e.g. for missing values etc.
            try {
                // first we check if the email exists
                const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/emailCheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    // all the useStates from above
                    email: email,
                })
            });
            // converts the data to json
            const responseData = await response.json();
            // if the email exists, it sends the email back
            if (responseData.length === 1) {
                window.alert(`The email ${responseData[0].value} already exists.\nLog in with this email or use another email to sign up.`)
                return
            }
            if (!response.ok) {
                // if the posted data did not pass server-side validation
            throw new Error(responseData.message);
            }
            // we are now done sending data, so setLoading = false
            setLoading(false);
            // log the user in after signing up, by using their userID
            } catch (err) {
                try {
                    const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        // all the useStates from above
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        gender: gender,
                        genderInterest: genderInterest,
                        interest: interest,
                        ageInterestMin: ageMin,
                        ageInterestMax: ageMax,
                        city: city,
                        description: description,
                        email: email,
                        password: password
                    })
                });
                // converts the data to json
                const responseData = await response.json();
                //console.log(responseData)
                if (!response.ok) {
                    // if the posted data did not pass server-side validation
                throw new Error(responseData.message);
                }
                // we are now done sending data, so setLoading = false
                setLoading(false);
                // log the user in after signing up, by using their userID
                auth.login(responseData.loginLogic[0].value, responseData.token);
                history.push(`/homepage/${responseData.loginLogic[0].value}`);
                } catch (err) {
                    // catch error if it couldn't even connect to the API route for some reason
                    setLoading(false);
                    console.log(err)
                }
            }
        }
    }

    return <div className='auth'>
        {/* Remember to set loading because it checks instantly */}
    {loading}
    <h2>{Login ? 'Login' : 'Sign up'}</h2>
    <form id='theData' onSubmit={submission}>
        {/* If the user wants to sign up */}
        {!Login && (<div>
            <div>
            <label htmlFor='firstName'>First Name</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='firstName' name='firstName' value={firstName} onChange={event => setFirstName(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='lastName'>Last Name</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='lastName' name='lastName' value={lastName} onChange={event => setLastName(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='age'>Age:</label><br></br>
            <input type='number' id='age' min= '18' max= '100' name='age' value={age} onChange={event => setAge(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='genderList'>Your gender is ...</label><br></br>
                <select form='theData' id='genderList' onChange={event => setGender(event.target.value)}>
            <option value="" selected disabled hidden>Your gender</option>            
                {
                genderFetch.map(result => 
                    {
                    return(
                    <option value={result.id}>{result.gender}</option>
                    )
                }
                )
                }
            </select><br></br>
            </div>

            <div>
            <label htmlFor='genderInterestList'>You are interested in what gender?</label><br></br>
                <select form='theData' id='genderInterestList' onChange={event => setGenderInterest(event.target.value)}>
            <option value="" selected disabled hidden>Who?</option>            
                {
                genderInterestFetch.map(result => 
                    {
                    return(
                    <option value={result.id}>{result.gender_Interest}</option>
                    )
                }
                )
                }
            </select><br></br>
            </div>

            <div>
            <label htmlFor='interestList'>You are interested in</label><br></br>
                <select form='theData' id='interestList' onChange={event => setInterest(event.target.value)}>
            <option value="" selected disabled hidden>Which interest matches you?</option>            
                {
                interestFetch.map(result => 
                    {
                    return(
                    <option value={result.id}>{result.interest}</option>
                    )
                }
                )
                }
            </select><br></br>
            </div>

            <div>
            <label htmlFor='ageInterest'>Which ages are you interested in?</label><br></br>
            <label htmlFor='ageMin'>Minimum age</label><br></br>
            <input type='number' id='ageMin' min= '18' max ='100' name='ageInterest' value={ageMin} onChange={event => setAgeMin(event.target.value)}></input><br></br>
            <label htmlFor='ageMax'>Maximum age</label><br></br>
            <input type='number' id='ageMax' min= '18' max='100' name='ageInterest' value={ageMax} onChange={event => setAgeMax(event.target.value)}></input>
            <br></br>
            </div>

            <div>
            <label htmlFor='city'>City</label><br></br>
            <input type='text' id='city' name='city' value={city} onChange={event => setCity(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='description'>Description:</label><br></br>
            <input type='text' id='description' name='description' value={description} onChange={event => setDescription(event.target.value)}></input><br></br>
            </div>
        </div>)}

        <div>
        <label htmlFor='email'>Email:</label><br></br>
        <input type='email' id='email' name='email' value={email} onChange={event => setEmail(event.target.value)}></input><br></br>
        </div>
        <div>
        <label htmlFor='password'>Password:</label><br></br>
        <input type='password' id='password' name='password' value={password} onChange={event => setPassword(event.target.value)}></input><br></br><br></br>
        </div>
        <input type="submit" value={Login ? 'Login' : 'Sign up'}></input>
    </form>
    {/*switch between login and signup*/}
    <button onClick={modeHandler}>{Login ? 'Sign up' : 'Already got a user? Log in!'}</button>
    </div>
};

export default Auth;