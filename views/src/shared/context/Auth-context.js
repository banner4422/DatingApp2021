import { createContext } from 'react';

export const AuthContext = createContext({ 
    isLoggedIn: false,
    userID: null,
    token: null,
    is_admin: false,
    login: () => {}, 
    logout: () => {},
    adminLogin: () => {}
});

