import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

function SignInPage() {
  return (
    <div className="sign-in-page page__main-div">
      <h1 className="page-header">Sign In</h1>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
  );
}

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <form className="form sign-in__form" onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
          className="form__input sign-in__form__input"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
          className="form__input sign-in__form__input"
        />
        <button
          disabled={isInvalid}
          className={
            isInvalid
              ? "button form__button sign-in-button button--isInvalid"
              : "button form__button sign-in-button"
          }
          type="submit"
        >
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

function PasswordForgetLink() {
  return (
    <Link
      className="button form__input pw-forget__button"
      to={ROUTES.PASSWORD_FORGET}
    >
      Forgot Password?
    </Link>
  );
}

const SignUpLink = () => {
  return (
    <div className="sign-up-link__div">
      <p className="sign-up-link__p">Don't have an account?</p>
      <Link to={ROUTES.SIGN_UP} className="button sign-up__button">
        Sign Up
      </Link>
    </div>
  );
};

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignInPage;

export { SignInForm };
