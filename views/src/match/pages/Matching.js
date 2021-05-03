import React, { useEffect, useState, useContext } from 'react';
import PotentialMatchParent from '../components/PotentialMatchParent';
import { AuthContext } from '../../shared/context/Auth-context';
import { useParams } from 'react-router-dom';
import loadingGIF from '../../shared/components/loadingGIF.gif'

{/*shows a potential match. Should only show one potential match at a time, 
and show a new potential match for every time a button is clicked

I made a mistake by copypasting the Matches.js logic, which is why it renders every existing user LOL
To only render one user, you could a single js file, no components.

An explanation of the logic below can be found in ./Matches, because the code is exactly the same,
just a different API route

*/}
const Matching = () => {
    const [loading, setLoading] = useState(false);
    const [userLoad, setUserLoad] = useState();

    const userID = useParams().userID;
    const auth = useContext(AuthContext)

    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/getPotentialMatches?userID=${userID}`);
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setUserLoad(results);
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

    return (
        <React.Fragment>
    {!loading && userLoad && <PotentialMatchParent items={userLoad} />}
    </React.Fragment>
    );
};

export default Matching;
