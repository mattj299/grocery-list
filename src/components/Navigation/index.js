import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

// Used in SignOutButton to allow Sign Out of firebase auth
import { FirebaseContext } from "../Firebase";

// Use this as a global context to not prop drill through every level in order to get to ListItem
const CloseNavGLobalContext = React.createContext();

function Navigation() {
  // True if nav is open, false if closed
  const [openNav, setOpenNav] = useState(false);

  const authUser = useContext(AuthUserContext);

  const toggleNav = () => setOpenNav(!openNav);

  const closeNav = () => setOpenNav(false);

  // If user clicks outside of nav when nav is open then close the nav
  const outsideContentClick = (e) => {
    if (!openNav) return;
    const outsideNav = e.target.closest(".nav");
    if (!outsideNav) {
      closeNav();
    }
  };

  useEffect(() => {
    // If user resizes when nav is open close the nav
    window.addEventListener("resize", closeNav);
    // If user clicks outside of nav when nav is open then close the nav
    window.addEventListener("click", outsideContentClick);

    return () => {
      window.removeEventListener("resize", closeNav);
      window.removeEventListener("click", outsideContentClick);
    };
  });

  return (
    <CloseNavGLobalContext.Provider value={closeNav}>
      {authUser ? (
        <NavigationAuth openNav={openNav} toggleNav={toggleNav} />
      ) : (
        <NavigationNonAuth openNav={openNav} toggleNav={toggleNav} />
      )}
    </CloseNavGLobalContext.Provider>
  );
}

function NavigationAuth({ openNav, toggleNav }) {
  return (
    <ul className="nav">
      <div className="nav-left">
        <Logo />
      </div>
      <div className="nav-menu" onClick={toggleNav}>
        {openNav ? <AiOutlineClose /> : <AiOutlineMenu />}
      </div>
      <div className={openNav ? "nav-right nav-open" : "nav-right"}>
        <ListItem route={ROUTES.HOME} text="Home" />
        <ListItem route={ROUTES.ACCOUNT} text="Account" />
        <ListItem route={ROUTES.ADMIN} text="Admin" />
        <SignOutButton />
      </div>
    </ul>
  );
}

function NavigationNonAuth({ openNav, toggleNav }) {
  return (
    <ul className="nav">
      <div className="nav-left">
        <Logo />
      </div>
      <div className="nav-menu" onClick={toggleNav}>
        {openNav ? <AiOutlineClose /> : <AiOutlineMenu />}
      </div>
      <div className={openNav ? "nav-right nav-open" : "nav-right"}>
        <ListItem route={ROUTES.SIGN_IN} text="Sign In" />
        <ListItem route={ROUTES.PASSWORD_FORGET} text="Forget Password" />
        <ListItem route={ROUTES.SIGN_UP} text="Sign Up" />
      </div>
    </ul>
  );
}

function SignOutButton() {
  const firebase = useContext(FirebaseContext);
  const closeNav = useContext(CloseNavGLobalContext);
  return (
    <button
      type="button"
      className="button nav__list-link nav__sign-out-button"
      onClick={() => {
        firebase.doSignOut();
        closeNav();
      }}
    >
      Sign Out
    </button>
  );
}

function Logo() {
  const closeNav = useContext(CloseNavGLobalContext);
  return (
    <Link
      to={ROUTES.HOME}
      className="nav__list-link nav-logo__link"
      onClick={closeNav}
    >
      <li className="nav__list-item nav-logo__item">Photo Library</li>
    </Link>
  );
}

function ListItem({ route, text }) {
  const closeNav = useContext(CloseNavGLobalContext);

  return (
    <Link to={route} className="nav__list-link" onClick={closeNav}>
      <li className="nav__list-item">{text}</li>
    </Link>
  );
}

export default Navigation;
