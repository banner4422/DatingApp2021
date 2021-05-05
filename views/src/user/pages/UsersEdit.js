import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/Auth-context';
import { useForm } from "react-hook-form";
import './Users.css'
import loadingGIF from '../../shared/components/loadingGIF.gif'
import Select from './components/Dropdown'

const UsersEdit = () => {
    // react-hook-form functionalities
    const { register, handleSubmit } = useForm();
    // auth route
    const auth = useContext(AuthContext);
    // loading state
    const [loading, setLoading] = useState(false);
    // history to link back
    const history = useHistory();

    // states for existing data to be used in defaultValues
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [city, setCity] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');

    // default values for preview to be used in defaultValues
    const defaultValues = {
        firstName: firstName,
        lastName: lastName,
        city: city,
        age: age,
        description: description,
        ageMin: ageMin,
        ageMax: ageMax,
    }

    // options being fetched
    const [genderFetch, setGenderFetch] = useState([]);
    const [genderInterestFetch, setGenderInterestFetch] = useState([]);
    const [interestFetch, setinterestFetch] = useState([]);
    
    // states for existing data to be used in Selects/dropdown lists
    const [selectGenderBox, setSelectGenderBox] = useState()
    const [selectGenderInterestBox, setSelectGenderInterestBox] = useState()
    const [selectInterestBox, setSelectInterestBox] = useState()
    console.log(selectGenderBox)
    console.log(selectGenderInterestBox)
    console.log(selectInterestBox)

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
                setFirstName(results[1].value);
                setLastName(results[2].value)
                setCity(results[3].value);
                setAge(results[4].value);
                setDescription(results[9].value);
                setAgeMin(results[12].value);
                setAgeMax(results[13].value);

                // for use in dropdowns
                setSelectGenderBox(results[7].value)
                setSelectGenderInterestBox(results[10].value)
                setSelectInterestBox(results[5].value)
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);

    // handles the value event of gender
    function onChangeGender(event) {
        setSelectGenderBox(event.target.value);
    }

    // handles the value event of gender interest
    function onChangeGenderInterest(event) {
        setSelectGenderInterestBox(event.target.value);
    }

    // handles the value event of interest
    function onChangeInterest(event) {
        setSelectInterestBox(event.target.value);
    }
    
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
                    userID: userID, 
                    firstName: data.firstName,
                    lastName: data.lastName,
                    age: data.age,
                    gender: selectGenderBox,
                    genderInterest: selectGenderInterestBox,
                    interest: selectInterestBox,
                    ageInterestMin: data.ageMin,
                    ageInterestMax: data.ageMax,
                    city: data.city,
                    description: data.description,
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
                history.push(`/user/${auth.userID}`)
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
    if (!description) {
        return (<div className='center'>
          <h2>Could not find user, ERROR</h2>
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
            <Select
            form='theData'
            id='genderList'
            name='genderList'
            value={selectGenderBox}
            onChange={onChangeGender}
            data={genderFetch}
             />
            </div>

            <div>
            <label htmlFor='genderInterestList'>You are interested in what gender?</label><br></br>
            <Select
            form='theData' id='genderInterestList' name='genderInterestList'
            value={selectGenderInterestBox}
            onChange={onChangeGenderInterest}
            data={genderInterestFetch}
             />
            </div>

            <div>
            <label htmlFor='interestList'>You are interested in</label><br></br>
            <Select
            form='theData' id='interestList' name='interestList'
            value={selectInterestBox}
            onChange={onChangeInterest}
            data={interestFetch}
             />
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
            </div><br></br>

            <input type="submit" value='Update info'></input>

            </div>
        </form>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={auth.is_admin ? `/admin/users` : `/user/${auth.userID}`}>
              <button>Go back with no changes</button>
            </Link>
        </div>
        <br></br>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={`/user/edit/email/${userID}`}>
              <button>Change email</button>
            </Link>
        </div>
        <br></br>
        <div>
            {/* A button that links back to the user info*/}
            <Link to={`/user/edit/password/${userID}`}>
              <button>Change password</button>
            </Link>
        </div>
        <br></br>
        <div>
            {/* A button that links back to the user info*/}
            {auth.is_admin ? null : <Link to={`/user/delete/${auth.userID}`}>
              <button>Do you want to delete your user?</button>
            </Link>}
        </div>
    </div>
}

export default UsersEdit;