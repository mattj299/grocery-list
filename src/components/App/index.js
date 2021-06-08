import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "../Navigation";
import Footer from "../Footer";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { withFirebase } from "../Firebase";

function App({ firebase }) {
  // Signs user out when exits the page
  window.addEventListener("beforeunload", async () => {
    await firebase.doSignOut();
  });

  return (
    <Router>
      <div className="container">
        <div className="no-footer-content">
          <Navigation />

          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default withFirebase(withAuthentication(App));
