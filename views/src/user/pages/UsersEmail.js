import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import { useForm } from "react-hook-form";
import './Users.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'

const UsersEmail = () => {
    // react-hook-form functionalities
    const { register, handleSubmit } = useForm();
    // auth route
    const auth = useContext(AuthContext);
    // loading state
    const [loading, setLoading] = useState(false);
    // history to link back
    const history = useHistory();

    // states for existing data to be used in defaultValues
    const [email, setEmail] = useState('');

    // default values for preview to be used in defaultValues
    const defaultValues = {
        email: email
    }

    // userid from url
    const userID = useParams().userID;

    // fetches existing user data
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/TinderUserGetFullByID?id=${userID}`, {
                    method: 'GET',
                    headers: {
                        'token': auth.token
                    }
                });
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                console.log(results)

                // for defaultValues
                setEmail(results[14].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);
    
    // patch/update function, which gets used by handleSubmit and onSubmit
    const userUpdateInfo = async (data) => {
        // event.preventDefault is implemented ''under the hood'' of the handleSubmit method from react-hook-form https://labs.thisdot.co/blog/taming-forms-with-react-hook-form
        try {
        
          const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/tinderUserUpdateEmail', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                    userID: userID, 
                    email: data.email,
                    })
                });
                const responseData = await response.json();
                if (!response.ok) {
                throw new Error(responseData.message);
                }
                setLoading(false);
                if (auth.is_admin === true) {
                    history.push(`/admin/users`)
                } else {
                  auth.logout();
                  history.push(`/auth`)
            }
        } catch (err) {}
      };

    // meanwhile it loads, required for it to load properly
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

    // if the user can't be loaded for some reason
    if (!email) {
        return (<div className='center'>
          <h2>Could not find user, ERROR</h2>
        </div>)
    }

    // the actual page
    return <div className='Users'>
        <form id='theData' onSubmit={handleSubmit(userUpdateInfo)}>
            <div>

            <div>
              <h1>Change Email</h1>
            </div>
            <div>
              <h2>Your current email is {email}</h2>
            </div>
            <div>
              <h3>Remember your new email, because updating it will log you out and require you to log in again with your new email.</h3>
            </div>

            <div>
            <label htmlFor='email'>Insert your new email here</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='email' id='email' name='email' defaultValue={defaultValues.email} placeholder='Please enter an email' {...register('email')} /><br></br>
            </div><br></br>

            <input type="submit" value='Update email'></input>

            </div>
        </form>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={auth.is_admin ? `/admin/users` : `/user/edit/${auth.userID}`}>
              <button>Go back with no changes</button>
            </Link>
        </div>
    </div>
}

export default UsersEmail;