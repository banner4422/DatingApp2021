import React, { useState, useCallback } from 'react';
import { BrowserRouter,  Route, Redirect, Switch } from 'react-router-dom';

// imports all the possible pages and headers in the application
import Users from './user/pages/Users';
import UsersEdit from './user/pages/UsersEdit';
import Matching from './match/pages/Matching';
import Navigation from './shared/components/Navigation/Navigation'
import Matches from './match/pages/Matches';
import Auth from './user/pages/Auth';

// imports the authorisation context
import { AuthContext } from './shared/context/Auth-context'

/*

The hub of the whole application, literally called App.js
It gathers all the pages, manages if the user is logged in, authorisation etc.

useState is explained on some of the major pages.
useCallback is used for avoiding a function to run on every single render
Read more here https://reactjs.org/docs/hooks-reference.html#usecallback

*/

const App = () => {
  // manage the state of the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // manage the state of their userID
  const [userID, setUserID] = useState(false);
  // manage the state of their admin status
  const [is_admin, setIs_admin] = useState(false);

  // useCallback() to avoid infinite loops
  // function for when the user successfully logs in
  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserID(uid);
    setIs_admin(false)
  }, []);

  // function for admin user logging in successfully
  const adminLogin = useCallback(uid => {
    setIsLoggedIn(true);
    setUserID(uid);
    setIs_admin(true)
  }, []);

  // function for when the user successfully logs out
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserID(null);
    setIs_admin(null)
  }, []);

  // routes variable, to be used below for 
  // if the user is logged in or not and for Switch routing (further explanation below)
  let routes;
  // if the logged in user is an admin
  if (isLoggedIn && is_admin == true) {
    routes = (
      <React.Fragment>
        {/*Statistics page*/}
        <Route path='/admin/stats' exact>
          <Matches />
        </Route>
        {/*User page*/}
        <Route path='/admin/users' exact>
          <Matches />
        </Route>
        {/*Matches page*/}
        <Route path='/admin/matches' exact>
          <Matches />
        </Route>
        <Redirect to='/admin' />
      </React.Fragment>
    );
  // if the user is logged in
  } else if (isLoggedIn) {
    // if the user is logged in, then the routes are the following
    // react automatically adjusts to elements written with :, so it knows it's the userID for the path
    routes = (
      // Fragments let you group a list of children without adding extra nodes to the DOM
      // it would not render without wrapping them into a <React.Fragment>
      // read more here https://reactjs.org/docs/fragments.html
      <React.Fragment>
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
        {/*user page routes - commented out
        <Route path='/user/edit/email/:userID' exact>
          <UsersEmail />
        </Route>
        <Route path='/user/edit/password/:userID' exact>
          <UsersPassword />
        </Route>
        */}

        {/*user matches route*/}
        <Route path='/matches/:userID' exact>
          <Matches />
        </Route>

        {/*Our front page which will include matching*/}
        <Route path='/' exact>
          <Matching />
        </Route>
        {/*
        Redirect at the end for if the user writes an invalid url while being logged in,
        it redirects them to the frontpage
        */}
        <Redirect to='/' />
      </React.Fragment>
    );
  } else {
    // if the user isn't logged in
    routes = (
      <React.Fragment>
        {/*Auth login*/}
        <Route path='/auth' exact>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </React.Fragment>
    );
  }
  {/*auth context provider, for use in our header nav links
  Read more about Context.provider here https://reactjs.org/docs/context.html#contextprovider
  */}
  return (
  <AuthContext.Provider 
  value={{ isLoggedIn: isLoggedIn, 
    userID: userID,
    login: login, 
    logout: logout,
    adminLogin: adminLogin,
    is_admin: is_admin  }}
  >
    {/* The rendering of the multi-page web application */}
    {/*
    <BrowserRouter> is a <Router> that uses the HTML5 history API (pushState, replaceState and the popstate event) 
    to keep your UI in sync with the URL.
    https://reactrouter.com/web/api/BrowserRouter
    */}
    <BrowserRouter>
      {/* The navigation header for every page, with logic in the object for if
      the user is logged in or not */}
      <Navigation />
      <main>
      {/*switch routing*/}
      <Switch>
        {/* we have done our switching logic in the routes element, 
        that changes depending on if a user is logged in or not
        Read more about Switch here https://reactrouter.com/web/api/Switch */}
        {routes}
      </Switch>
      </main>
    </BrowserRouter>
  </AuthContext.Provider>
  );
};

export default App;
