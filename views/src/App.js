import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router,  Route, Switch } from 'react-router-dom';

// imports all the possible pages and headers in the application
import Users from './user/pages/Users';
import UsersEdit from './user/pages/UsersEdit';
import UsersEmail from './user/pages/UsersEmail';
import UsersPassword from './user/pages/UsersPassword';
import UserDelete from './user/pages/UserDelete';
import Matching from './match/pages/Matching';
import Navigation from './shared/components/Navigation/Navigation'
import NotFound from './shared/components/NotFound'
import Matches from './match/pages/Matches';
import Auth from './user/pages/Auth';
import AdminStats from './admin/pages/adminStats';
import AdminUsers from './admin/pages/adminUsers';
import Homepage from './user/pages/Homepage';

// imports the authorisation context
import { AuthContext } from './shared/context/Auth-context'

/*

The hub of the whole application, literally called App.js
It gathers all the pages, manages if the user is logged in, authorisation etc.

useState is explained on some of the major pages.
useCallback is used for avoiding a function to run on every single render
Read more here https://reactjs.org/docs/hooks-reference.html#usecallback

*/

let timer;

const App = () => {
  // manage the state of the user is logged in or not
  const [token, setToken] = useState(false);
  // manage the state of their userID
  const [userID, setUserID] = useState(false);
  // manage the state of their admin status
  const [is_admin, setIs_admin] = useState(false);
  // token expiration state
  const [tokenExpDate, setTokenExpDate] = useState();

  // useCallback() to avoid infinite loops
  // function for when the user successfully logs in
  const login = useCallback((uid, token, admin, expDate) => {
    setToken(token);
    setUserID(uid);
    setIs_admin(false);
    const expData = expDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365);
    setTokenExpDate(expData);
    localStorage.setItem('userData', JSON.stringify({userID: uid, token: token, is_admin: admin, expires: expData.toISOString()}))
  }, []);

  // function for admin user logging in successfully
  const adminLogin = useCallback((uid, token, admin, expDate) => {
    setToken(token);
    setUserID(uid);
    setIs_admin(true)
    const expData = expDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365);
    setTokenExpDate(expData);
    localStorage.setItem('userData', JSON.stringify({userID: uid, token: token, is_admin: admin, expires: expData.toISOString()}))
  }, []);

  // function for when the user successfully logs out
  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);
    setIs_admin(null);
    setTokenExpDate(null);
    localStorage.removeItem('userData')
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remain = tokenExpDate.getTime() - new Date().getTime();
      timer = setTimeout(logout, remain)
    } else {
      clearTimeout(timer);
    }
  }, [token, logout, tokenExpDate]);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem('userData'));
    if (storageData && storageData.token && new Date(storageData.expires) > new Date()) {
      if (storageData.is_admin === true) {
        adminLogin(storageData.userID, storageData.token, storageData.is_admin, new Date(storageData.expires));
      } else {
        login(storageData.userID, storageData.token, storageData.is_admin, new Date(storageData.expires));
    }
    }
  }, [login]);

  // routes variable, to be used below for 
  // if the user is logged in or not and for Switch routing (further explanation below)
  let routes;
  // if the logged in user is an admin
  if (token && is_admin === true) {
    routes = (
      <React.Fragment>
        <Switch>
        {/*Statistics page*/}
        <Route path='/admin/stats' exact>
          <AdminStats />
        </Route>
        {/*User page*/}
        <Route path='/admin/users' exact>
          <AdminUsers />
        </Route>
        <Route path='/user/edit/:userID' exact>
          <UsersEdit />
        </Route>
        <Route path='/user/edit/email/:userID' exact>
          <UsersEmail />
        </Route>

        <Route path='/user/edit/password/:userID' exact>
          <UsersPassword />
        </Route>
        <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  // if the user is logged in
  } else if (token) {
    // if the user is logged in, then the routes are the following
    // react automatically adjusts to elements written with :, so it knows it's the userID for the path
    routes = (
      // Fragments let you group a list of children without adding extra nodes to the DOM
      // it would not render without wrapping them into a <React.Fragment>
      // read more here https://reactjs.org/docs/fragments.html
      <React.Fragment>
        <Switch>
        {/*
        Route renders the wrapped in element (which in this case is a page) at a specificly defined route
        */}
        {/*user page routes*/}
        <Route path='/user/:userID' exact>
          {/*
        In here is the page being rendered at this specific route, 
        which in this case is the user info for the logged in user
        */}
          <Users />
        </Route>
        <Route path='/user/edit/:userID' exact>
          <UsersEdit />
        </Route>
        <Route path='/user/delete/:userID' exact>
          <UserDelete />
        </Route>
        <Route path='/user/edit/email/:userID' exact>
          <UsersEmail />
        </Route>

        <Route path='/user/edit/password/:userID' exact>
          <UsersPassword />
        </Route>

        {/*user matches route*/}
        <Route path='/matches/:userID' exact>
          <Matches />
        </Route>

        <Route path='/matching/:userID' exact>
          <Matching/>
        </Route>

        {/*Our front page which will include matching*/}
        <Route path='/homepage/:userID' exact>
          <Homepage />
        </Route>
        {/*
        Redirect at the end for if the user writes an invalid url while being logged in,
        it redirects them to the frontpage
        
        */}
        <Route component={NotFound} />
            
        </Switch>
      </React.Fragment>
    );
  } else {
    // if the user isn't logged in
    routes = (
      <React.Fragment>
        <Switch>
        {/*Auth login*/}
        <Route path='/' exact>
          <Auth />
        </Route>
        <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  }
  {/*auth context provider, for use in our header nav links
  Read more about Context.provider here https://reactjs.org/docs/context.html#contextprovider
  */}
  return (
  <AuthContext.Provider 
  value={{ isLoggedIn: !!token, 
    token: token,
    userID: userID,
    login: login, 
    logout: logout,
    adminLogin: adminLogin,
    is_admin: is_admin  }}
  >
    {/* The rendering of the single-page web application */}
    {/*
    <BrowserRouter> is a <Router> that uses the HTML5 history API (pushState, replaceState and the popstate event) 
    to keep your UI in sync with the URL.
    https://reactrouter.com/web/api/BrowserRouter
    */}
    <Router>
      {/* The navigation header for every page, with logic in the object for if
      the user is logged in or not */}
      <Navigation />
      <main>
      {/*switch routing*/}

        {/* we have done our switching logic in the routes element, 
        that changes depending on if a user is logged in or not
        Read more about Switch here https://reactrouter.com/web/api/Switch */}
        {routes}

      </main>
    </Router>
  </AuthContext.Provider>
  );
};

export default App;
