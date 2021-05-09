import React, { useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import './Users.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'

const UserDelete = () => {
    const [loading, setLoading] = useState(false);
    const userID = useParams().userID;
    const history = useHistory();

    const auth = useContext(AuthContext)

        const DELETE = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/tinderUserDelete?userID=${userID}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                });
                const results = await response.json();
                console.log(results);
                if(!response.ok) {
                    throw new Error(results.message);
                }
            } catch (err) {
                console.log(err)
            }
            setLoading(false);
            auth.logout();
            history.push(`/`)
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
    return <div div className='Users'>
        <h1>Deleting your account</h1>
        <h3>Are you sure that you want to delete your account?</h3>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={`/user/${userID}`}>
              <button>No, take me back</button>
            </Link>
        </div>
        <div className='match-delete'>
            <button onClick={DELETE}>Yes I want to delete my account</button>
        </div>
        
        </div>
}
export default UserDelete;