import React, { useState, useEffect, useContext} from 'react';
//import UserParent from '../components/UserParent';
import { useParams, Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import './Users.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'

{/*
Renders the current information for the logged in user

An explanation of the logic below can be found in ./Matches, because the code is exactly the same,
just a different API route

*/}

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [interest, setInterest] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [genderInterest, setGenderInterest] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const userID = useParams().userID;
  const auth = useContext(AuthContext);

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
                setFullName(results[1].value + ' ' + results[2].value);
                setCity(results[3].value);
                setAge(results[4].value);
                setInterest(results[6].value);
                setGender(results[8].value);
                setDescription(results[9].value);
                setGenderInterest(results[11].value);
                setAgeMin(results[12].value);
                setAgeMax(results[13].value);
                setEmail(results[14].value);
                setPassword(results[15].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
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
      {loading}
      <div>
      <h2>{fullName}</h2>
      <h2>City: {city}</h2>
      <h2>Age: {age}</h2>
      <h2>Interest: {interest}</h2>
      <h2>Gender: {gender}</h2>
      <h2>Description: {description}</h2>
      <h2>Interested in: {genderInterest}</h2>
      <h2>Lowest age: {ageMin}</h2>
      <h2>Highest age: {ageMax}</h2>
      <h2>Email: {email}</h2>
      <h2>Password: {password}</h2>
      </div>
      <div>
      <Link to={`/user/edit/${userID}`}>
              <button>Edit user information</button>
              </Link>
      </div>
  </div>
};

export default Users;
