import React, { useState, useContext,  useEffect} from 'react';
import { useParams} from 'react-router-dom';
import './Homepage.css'
import { AuthContext } from '../../shared/context/Auth-context'

const Homepage = () => {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    
    const auth = useContext(AuthContext);
    console.log(auth.userID)
    /*const userID = useParams().userID;*/

    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend +`/api/TinderUserGetFullByID?id=${auth.userID}`);
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

    return <div className='Users'>
      {loading}
      <div>
      <h1>Welcome Back, {fullName} ! </h1>
      </div>
      <div>
      </div>
  </div>

}





export default Homepage;