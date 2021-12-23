import React, { useContext, useEffect } from "react";
import { Link, Route } from "react-router-dom";
import Navigation from "../Navigation";
import Footer from "../Footer";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import AccountPage from "../Account";

import HomeGrocery from "../HomeGrocery";

import bgSignInImg from "../../images/bgSignInImg.jpg";

import { AuthUserContext } from "../Session";
import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { withFirebase } from "../Firebase";

function App({ firebase }) {
  // checks if user is logged in, if so get rid of left container that's in non-signed in pages
  const authUser = useContext(AuthUserContext);

  // Signs user out when exits the page
  window.addEventListener("beforeunload", async () => {
    await firebase.doSignOut();
  });

  // focuses on input if on sign in page, if not on sign in page then shoudl reroute to it but doesn't focus on input
  const focusOnInput = (e) => {
    const formInput = document.getElementsByClassName(
      "sign-in__form__input"
    )[0];

    if (formInput) formInput.focus();
  };

  // fix page when screen gets larger
  // fix page when screen gets larger
  // fix page when screen gets larger
  // fix page when screen gets larger
  // fix page when screen gets larger
  // fix page when screen gets larger
  // fix page when screen gets larger

  return (
    <>
      {!authUser && (
        <div className="non-logged-in-left-img-container">
          <div className="non-logged-in-text-content">
            <h4 style={{ top: "-100px" }} className="non-logged-in-text">
              <span className="non-logged-in-text-span">
                Create, Check, Update
              </span>
            </h4>
            <h4 style={{ top: "-50px" }} className="non-logged-in-text">
              <br></br>Grocery Lists<br></br> now just clicks away!
            </h4>
            <Link
              style={{ top: "90px" }}
              to={ROUTES.SIGN_IN}
              onClick={focusOnInput}
              className="button sign-up__button non-logged-in-left-button"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      )}

      <div
        className={authUser ? "container container__logged-in" : "container"}
      >
        <div className="no-footer-content">
          <Navigation />

          <div className="no-navigation-footer-content">
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.HOME} component={HomeGrocery} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default withFirebase(withAuthentication(App));
