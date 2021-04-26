import React, { useState, useEffect} from 'react';
//import UserParent from '../components/UserParent';
import { useParams, Link } from 'react-router-dom';
import './Users.css'

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
                setCity(results[3].value);
                setAge(results[4].value);
                setInterest(results[5].value);
                setGender(results[6].value);
                setDescription(results[7].value);
                setGenderInterest(results[8].value);
                setAgeMin(results[9].value);
                setAgeMax(results[10].value);
                setEmail(results[11].value);
                setPassword(results[12].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    if (loading) {
        return (<div className='center'>
          <h2>LOADING</h2>
        </div>)
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

{/* <h2>{userLoad[1].value} {userLoad[2].value}</h2>
      <h2>City: {userLoad[3].value}</h2>
      <h2>Age: {userLoad[4].value}</h2>
      <h2>Interest: {userLoad[5].value}</h2>
      <h2>Gender: {userLoad[6].value}</h2>
      <h2>Description: {userLoad[7].value}</h2>
      <h2>Interested in: {userLoad[8].value}</h2>
      <h2>Lowest age: {userLoad[9].value}</h2>
      <h2>Highest age: {userLoad[10].value}</h2>
      <h2>Email: {userLoad[12].value}</h2>
      <h2>Password: {userLoad[13].value}</h2> */}

export default Users;
