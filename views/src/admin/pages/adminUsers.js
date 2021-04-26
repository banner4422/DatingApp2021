import React, { useState, useEffect } from 'react';
import './adminStats.css'
import AdminUsersParent from '../components/adminUsersParent'
import loadingGIF from '../../shared/components/loadingGIF.gif'

const AdminUsers = () => {
    const [loading, setLoading] = useState(false);
    const [userLoad, setUserLoad] = useState();

    useEffect (() => {
        const GET = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://' + process.env.REACT_APP_backend + `/api/admiGetAllUsers`);
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

    if (!userLoad) {
        return (<div className='center'>
          <h2>No users, Database error.</h2>
        </div>)
      }
    return (
        <React.Fragment>
    {!loading && userLoad && <AdminUsersParent items={userLoad} />}
    </React.Fragment>
    );
};

export default AdminUsers;