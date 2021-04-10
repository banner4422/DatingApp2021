import React, { useEffect, useState } from 'react';
import PotentialMatchParent from '../components/PotentialMatchParent';

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

    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:' + process.env.REACT_APP_backendPort +'/api/user/');
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setUserLoad(results.users);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, []);
    return (
        <React.Fragment>
    {!loading && userLoad && <PotentialMatchParent items={userLoad} />}
    </React.Fragment>
    );
};

export default Matching;
