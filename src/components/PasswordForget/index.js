import React, { Component } from "react";

import { withFirebase } from "../Firebase";

function PasswordForgetPage() {
  return (
    <div className="page__main-div">
      <div className="page-div-content">
        <h1 className="page-header">Password Forget</h1>
        <h4 className="page__sub-header">Trouble logging in?</h4>
        <p className="page__desc">
          Enter your email address and we'll send you
          <br></br> an email to get you back into your account!
        </p>
        <PasswordForgetForm />
      </div>
    </div>
  );
}

const INITIAL_STATE = {
  email: "",
  error: null,
  success: false,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE, success: true });
      })
      .catch((error) => {
        this.setState({ error, success: false });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error, success } = this.state;

    const isInvalid = email === "";

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          type="text"
          onChange={this.onChange}
          placeholder="Email Address"
          className="form__input"
        />
        <button
          className={
            isInvalid
              ? "button form__button button--isInvalid"
              : "button form__button"
          }
          disabled={isInvalid}
          type="submit"
        >
          Reset My Password
        </button>

        {success && <p>An email has been sent!</p>}
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default PasswordForgetPage;

export { PasswordForgetForm };
