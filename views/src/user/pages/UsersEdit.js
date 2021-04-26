import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import { useForm } from "react-hook-form";
import './Users.css'

const UsersEdit2 = () => {
    // react-hook-form functionalities
    const { register, handleSubmit } = useForm();
    // auth route
    const auth = useContext(AuthContext);
    // loading state
    const [loading, setLoading] = useState(false);
    // history to link back
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

    // default values for preview
    const defaultValues = {
        firstName: firstName,
        lastName: lastName,
        city: city,
        age: age,
        interest: interest,
        gender: gender,
        description: description,
        genderInterest: genderInterest,
        ageMin: ageMin,
        ageMax: ageMax,
        email: email,
        password: password
    }

    // options being fetched
    const [genderFetch, setGenderFetch] = useState([]);
    const [genderInterestFetch, setGenderInterestFetch] = useState([]);
    const [interestFetch, setinterestFetch] = useState([]);

    // fetches genders
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

    // userid from url
    const userID = useParams().userID;

    // fetches existing user data
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
                setEmail(results[11].value);
                setPassword(results[12].value);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    /*
    const onSubmit = (data) => {
        alert(JSON.stringify({
            yourID: userID, 
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            gender: data.genderList,
            genderInterest: data.genderInterestList,
            interest: data.interestList,
            ageInterestMin: data.ageMin,
            ageInterestMax: data.ageMax,
            city: data.city,
            description: data.description,
            email: data.email,
            password: data.password,
        }));
      };
      */
    
    // patch/update function, which gets used by handleSubmit and onSubmit
    const userUpdateInfo = async (data) => {
        // event.preventDefault is implemented ''under the hood'' of the handleSubmit method from react-hook-form https://labs.thisdot.co/blog/taming-forms-with-react-hook-form
        try {
        
          const response = await fetch('http://' + process.env.REACT_APP_backend + '/api/tinderUserUpdate', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                    yourID: userID, 
                    firstName: data.firstName,
                    lastName: data.lastName,
                    age: data.age,
                    gender: data.genderList,
                    genderInterest: data.genderInterestList,
                    interest: data.interestList,
                    ageInterestMin: data.ageMin,
                    ageInterestMax: data.ageMax,
                    city: data.city,
                    description: data.description,
                    email: data.email,
                    password: data.password,
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

    // if the user can't be loaded for some reason
    if (!firstName) {
        return (<div className='center'>
          <h2>Could not find user, ERROR</h2>
        </div>)
      }
    // meanwhile it loads, required for it to load properly
      if (loading) {
        return (<div className='center'>
          <h2>LOADING</h2>
        </div>)
      }
    // the actual page
    return <div className='Users'>
        <form id='theData' onSubmit={handleSubmit(userUpdateInfo)}>
            <div>
            <div>
            <label htmlFor='firstName'>First Name</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='firstName' name='firstName' defaultValue={defaultValues.firstName} placeholder='First Name' {...register('firstName')} /><br></br>
            </div>

            <div>
            <label htmlFor='lastName'>Last Name</label><br></br>
            {/* The onChange function updates the state based on user input, same goes for the others below */}
            <input type='text' id='lastName' name='lastName' defaultValue={defaultValues.lastName} placeholder='Last Name' {...register('lastName')}></input><br></br>
            </div>

            <div>
            <label htmlFor='age'>Age:</label><br></br>
            <input type='number' id='age' min= '18' max= '100' name='age' defaultValue={defaultValues.age} {...register('age')}></input><br></br>
            </div>

            
            <div>
            <label htmlFor='genderList'>Your gender is ...</label><br></br>
                <select form='theData' id='genderList' name='genderList' defaultValue={defaultValues.gender} required {...register('genderList')}>
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
                <select form='theData' id='genderInterestList' name='genderInterestList' defaultValue={defaultValues.genderInterest} required {...register('genderInterestList')}>
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
                <select form='theData' id='interestList' name='interestList' defaultValue={defaultValues.interest} required {...register('interestList')}>
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
            <input type='number' id='ageMin' min= '18' max ='100' name='ageMin' defaultValue={defaultValues.ageMin} {...register('ageMin')}></input><br></br>
            <label htmlFor='ageMax'>Maximum age</label><br></br>
            <input type='number' id='ageMax' min= '18' max='100' name='ageMax' defaultValue={defaultValues.ageMax} {...register('ageMax')}></input>
            <br></br>
            </div>

            <div>
            <label htmlFor='city'>City</label><br></br>
            <input type='text' id='city' name='city' defaultValue={defaultValues.city} {...register('city')}></input><br></br>
            </div>

            <div>
            <label htmlFor='description'>Description:</label><br></br>
            <input type='text' id='description' name='description' defaultValue={defaultValues.description} {...register('description')}></input><br></br>
            </div>
            <div>
            <label htmlFor='email'>Email:</label><br></br>
            <input type='email' id='email' name='email' defaultValue={defaultValues.email} {...register('email')}></input><br></br>
            </div>
            <div>
            <label htmlFor='password'>Password:</label><br></br>
            <input type='password' id='password' name='password' defaultValue={defaultValues.password} {...register('password')}></input><br></br><br></br>
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