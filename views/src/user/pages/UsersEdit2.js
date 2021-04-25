import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import './Users.css'

const UsersEdit2 = () => {
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // states for existing data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

    // states for updated data
    const [updatedFirstName, setUpdatedFirstName] = useState('');
    const [updatedLastName, setUpdatedLastName] = useState('');
    const [updatedAge, setUpdatedAge] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [updatedGender, setUpdatedGender] = useState('');
    const [updatedGenderInterest, setUpdatedGenderInterest] = useState('');
    const [updatedCity, setUpdatedCity] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedInterest, setUpdatedInterest] = useState('');
    const [updatedAgeMin, setUpdatedAgeMin] = useState('');
    const [updatedAgeMax, setUpdatedAgeMax] = useState('');

    console.log(updatedFirstName)
    console.log(updatedLastName)
    console.log(updatedAge)
    console.log(updatedEmail)
    console.log(updatedPassword)
    console.log(updatedGender)
    console.log(updatedGenderInterest)
    console.log(updatedCity)
    console.log(updatedDescription)
    console.log(updatedInterest)
    console.log(updatedAgeMin)
    console.log(updatedAgeMax)

    const [genderFetch, setGenderFetch] = useState([]);
    const [genderInterestFetch, setGenderInterestFetch] = useState([]);
    const [interestFetch, setinterestFetch] = useState([]);

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
                setFirstName(results[1].value);
                setLastName(results[2].value)
                setCity(results[3].value);
                setAge(results[4].value);
                setInterest(results[5].value);
                setGender(results[6].value);
                setDescription(results[7].value);
                setGenderInterest(results[8].value);
                setAgeMin(results[9].value);
                setAgeMax(results[10].value);
                setEmail(results[12].value);
                setPassword(results[13].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    const userUpdateInfo = async event => {
        event.preventDefault();
        try {
        
          const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/tinderUserUpdate', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                      yourID: userID,
                      firstName: updatedFirstName,
                      lastName: updatedLastName,
                      age: updatedAge,
                      gender: updatedGender,
                      genderInterest: updatedGenderInterest,
                      interest: updatedInterest,
                      ageInterestMin: updatedAgeMin,
                      ageInterestMax: updatedAgeMax,
                      city: updatedCity,
                      description: updatedDescription,
                      email: updatedEmail,
                      password: updatedPassword
                    })
                });
                const responseData = await response.json();
                if (!response.ok) {
                throw new Error(responseData.message);
                }
                setLoading(false);
                history.push(`/user/${auth.userID}`)
        } catch (err) {}
      };

    if (!firstName) {
        return (<div className='center'>
          <h2>Could not find user, ERROR</h2>
        </div>)
      }
    return <div className='Users'>
        {loading}
        <form id='theData' onSubmit={userUpdateInfo}>
            <div>
            <div>
            <label htmlFor='firstName'>First Name</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='firstName' name='firstName' defaultValue={firstName} onChange={event => setUpdatedFirstName(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='lastName'>Last Name</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='lastName' name='lastName' defaultValue={lastName} onChange={event => setUpdatedLastName(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='age'>Age:</label><br></br>
            <input type='number' id='age' min= '18' max= '100' name='age' defaultValue={age} onChange={event => setUpdatedAge(event.target.value)}></input><br></br>
            </div>

            
            <div>
            <label htmlFor='genderList'>Your gender is ...</label><br></br>
                <select form='theData' id='genderList' onChange={event => setUpdatedGender(event.target.value)}>
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
                <select form='theData' id='genderInterestList' onChange={event => setUpdatedGenderInterest(event.target.value)}>
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
                <select form='theData' id='interestList' onChange={event => setUpdatedInterest(event.target.value)}>
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
            <input type='number' id='ageMin' min= '18' max ='100' name='ageInterest' defaultValue={ageMin} onChange={event => setUpdatedAgeMin(event.target.value)}></input><br></br>
            <label htmlFor='ageMax'>Maximum age</label><br></br>
            <input type='number' id='ageMax' min= '18' max='100' name='ageInterest' defaultValue={ageMax} onChange={event => setUpdatedAgeMax(event.target.value)}></input>
            <br></br>
            </div>

            <div>
            <label htmlFor='city'>City</label><br></br>
            <input type='text' id='city' name='city' defaultValue={city} onChange={event => setUpdatedCity(event.target.value)}></input><br></br>
            </div>

            <div>
            <label htmlFor='description'>Description:</label><br></br>
            <input type='text' id='description' name='description' defaultValue={description} onChange={event => setUpdatedDescription(event.target.value)}></input><br></br>
            </div>
            <div>
            <label htmlFor='email'>Email:</label><br></br>
            <input type='email' id='email' name='email' defaultValue={email} onChange={event => setUpdatedEmail(event.target.value)}></input><br></br>
            </div>
            <div>
            <label htmlFor='password'>Password:</label><br></br>
            <input type='password' id='password' name='password' defaultValue={password} onChange={event => setUpdatedPassword(event.target.value)}></input><br></br><br></br>
            </div>
            <input type="submit" value='Update info'></input>
            </div>
        </form>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={`/user/${auth.userID}`}>
              <button>Go back with no changes</button>
            </Link>
        </div>
        <br></br>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={`/user/delete/${auth.userID}`}>
              <button>Do you want to delete your user?</button>
            </Link>
        </div>
    </div>
}

export default UsersEdit2;