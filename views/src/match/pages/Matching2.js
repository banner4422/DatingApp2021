import React, {useEffect, useState} from 'react';
import './Matching.css'
import { useParams } from 'react-router-dom';
import loadingGIF from '../../shared/components/loadingGIF.gif'

const Matching = () => {
    const [loading, setLoading] = useState(false);
    const [potentialMatch, setpotentialMatch] = useState([]);
    //const [currentPage, setCurrentPage] = useState(0);
    console.log(potentialMatch)

    const userID = useParams().userID;

    // GET potential matches
    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            const timer = setTimeout(() => {
                console.log('This will run after 1 second!')
              }, 2000);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/getPotentialMatches?userID=${userID}`);
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setpotentialMatch(results);
                console.log(results)
            } catch (err) {
                console.log(err)
            }
            setLoading(false);
            return () => clearTimeout(timer);
        };
        GET();
    }, []);
    
    /*
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
    if (!potentialMatch)  {
            return (<div className='center'>
              <h2>No users, Database error.</h2>
            </div>)
    } 
    */
   
    return (<React.Fragment>
        {!loading && potentialMatch && <React.Fragment>
        <div className='adminStats'>
            <h2>Test</h2>
            
        <h1>Match with a user!</h1>
        <h2>{potentialMatch[0].first_name} {potentialMatch[0].last_name}</h2>
        <h2>Is {potentialMatch[0].age} and from {potentialMatch[0].city}</h2>
        <h2>The person is interested in {potentialMatch[0].gender_interest} and loves {potentialMatch[0].interest}</h2>
        <h3>Description:</h3>
        <p>{potentialMatch[0].description}</p>
        
    </div>
    <div className='adminUser-delete'>
        <button>Like</button>
        <button>Dislike</button>
    </div>
    </React.Fragment>
    }
    </React.Fragment>)
};

export default Matching;