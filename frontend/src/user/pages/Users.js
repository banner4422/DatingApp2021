import React, { useState, useEffect} from 'react';

import UserParent from '../components/UserParent';
import { useParams } from 'react-router-dom';

{/*
Renders the current information for the logged in user

An explanation of the logic below can be found in ./Matches, because the code is exactly the same,
just a different API route

*/}

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [userLoad, setUserLoad] = useState();

  const userID = useParams().userID;

    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:' + process.env.REACT_APP_backendPort +`/api/user/${userID}`);
                const results = await response.json();
                if(!response.ok) {
                    throw new Error(results.message);
                }
                setUserLoad([results.user]);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        };
        GET();
    }, [userID]);

  return (
        <React.Fragment>
    {!loading && userLoad && <UserParent items={userLoad} />}
    </React.Fragment>
    );
};

export default Users;
