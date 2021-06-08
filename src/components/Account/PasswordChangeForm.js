import React, { Component } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
  success: false,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error, success } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <form className="form" onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
          className="form__input"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
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

        {error && <p>{error.message}</p>}
        {success && <p>Successfully changed password!</p>}
      </form>
    );
  }
}
export default withFirebase(PasswordChangeForm);

//
// FIND OTHER LITTLE ERRORS THAT COULD POTENTIALLY BREAK THE SITE
// IF FINISHED DON'T BE AFRAID TO SAY YOU'RE DONE
// MAYBE TRY HOSTING THE SITE ON FIREBASE HOSTING, IMPLYING IT'S FREE
// MAYBE HAVE A DELETE ACCOUNT SO EVERYTHING FROM THE ACCOUNT GETS DELETED
//
