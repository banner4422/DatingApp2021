import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import { useForm } from "react-hook-form";
import './Users.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'

const UsersPassword = () => {
    // react-hook-form functionalities
    const { register, handleSubmit } = useForm();
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const userID = useParams().userID;
    
    // update password
    const userUpdateInfo = async (data) => {
        // event.preventDefault is implemented ''under the hood'' of the handleSubmit method from react-hook-form https://labs.thisdot.co/blog/taming-forms-with-react-hook-form
        // if the two password inputs doesn't equal each other
        if (data.passwordPlace !== data.password) {
          window.alert(`Your passwords doesn't match`)
          return
      }
        try {
          const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/tinderUserUpdatePassword', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                    userID: userID, 
                    password: data.password,
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
                  history.push(`/`)
            }
        } catch (err) {}
      };

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

    return <div className='Users'>
        <form id='theData' onSubmit={handleSubmit(userUpdateInfo)}>
            <div>

            <div>
              <h1>Change Password</h1>
            </div>
            <div>
              <h2>Remember your new password, because updating it will log you out and require you to log in again with your new password.</h2>
            </div>

            <div>
            <label htmlFor='passwordPlace'>Type your new password again</label><br></br>
            <input type='password' id='passwordPlace' name='passwordPlace' placeholder='Please enter a password' {...register('passwordPlace')} /><br></br>
            </div><br></br>

            <div>
            <label htmlFor='password'>Type your new password again</label><br></br>
            <input type='password' id='password' name='password' placeholder='Please enter a password' {...register('password')} /><br></br>
            </div><br></br>

            <input type="submit" value='Update password'></input>

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

export default UsersPassword;