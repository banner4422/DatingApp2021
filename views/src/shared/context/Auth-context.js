import { createContext } from 'react';

{/*
user authorization, for use across pages

It's state is mainly manipulated in ../../App.js, 
where the values get changed according to if the user is logged in or not

Read more about the createContext method here https://reactjs.org/docs/context.html#reactcreatecontext 

*/}
export const AuthContext = createContext({ 
    isLoggedIn: false,
    userID: null,
    is_admin: false,
    login: () => {}, 
    logout: () => {},
    adminLogin: () => {}
});

