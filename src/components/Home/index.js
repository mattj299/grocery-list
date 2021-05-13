import React, { useState, useContext } from "react";

import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Here you can add a bit of data to the database.</p>
      <HomePageForm />
    </div>
  );
}

// Gives data to database
const INITIAL_STATE = { header: "", text: "" };

function HomePageFormBase(props) {
  const [state, setState] = useState(INITIAL_STATE);
  const { header, text } = state;

  const authUser = useContext(AuthUserContext);

  async function onSubmit(event) {
    event.preventDefault();

    // Create a unique uuid for each object that gets pushed by the user

    const newDataRef = await props.firebase.user(authUser.uid).push();
    const key = newDataRef.key;
    newDataRef.set({
      header,
      text,
      key,
    });

    setState({ ...INITIAL_STATE });
  }

  function onChange(event) {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  const isInvalid = header === "" || text === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="header"
        value={header}
        onChange={onChange}
        type="text"
        placeholder="Header"
      />
      <input
        name="text"
        value={text}
        onChange={onChange}
        type="text"
        placeholder="Description"
      />

      <button disabled={isInvalid} type="submit">
        Submit
      </button>
    </form>
  );
}

const HomePageForm = withFirebase(HomePageFormBase);

const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(HomePage);
