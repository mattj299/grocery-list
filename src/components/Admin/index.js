import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import { withAuthorization, AuthUserContext } from "../Session";

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: [],
    };
  }

  // Retrieve all users, add them to state as an array full of user objects.
  componentDidMount() {
    let authUser = this.context;

    this.setState({ loading: true });

    // Access user from database, set it's data to the state and add the uid as a new item to the object
    this.props.firebase.user(authUser.uid).on("value", (snapshot) => {
      const userObject = snapshot.val();

      this.setState({
        user: userObject,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    let authUser = this.context;

    this.props.firebase.user(authUser.uid).off();
  }

  render() {
    const { user, loading } = this.state;

    const firebase = this.props.firebase;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>loading...</div>}

        <UserData firebase={firebase} user={user} />
      </div>
    );
  }
}

AdminPage.contextType = AuthUserContext;

function UserData({ user, firebase }) {
  // Remove data from database
  async function handleRemoveData(dataKey) {
    const userUid = user.uid;

    const firebaseUser = await firebase.user(userUid);
    const dataToRemove = firebaseUser.child(dataKey);
    dataToRemove.remove();
  }

  // Have an object holding all user data that are obects
  const objData = [];

  // Loop through all keys, push any values that are objects
  for (let key in user) {
    const userValue = user[key];
    if (typeof userValue === "object" && userValue !== null) {
      objData.push(userValue);
    }
  }

  // Map through array of objects to display as html
  const displayObjData = objData.map((objData) => {
    return (
      <React.Fragment key={objData.key}>
        <span>
          <strong>Header:</strong> {objData.header}
        </span>
        <br></br>
        <span>
          <strong>Text:</strong> {objData.text}
        </span>
        <br></br>
        <button
          type="button"
          onClick={() => {
            handleRemoveData(objData.key);
          }}
        >
          Remove
        </button>

        <br></br>
        <br></br>
      </React.Fragment>
    );
  });

  return (
    <ul>
      <li>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <br></br>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <br></br>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
        <br></br>
        <br></br>
        {objData ? displayObjData : null}
        <br></br>
      </li>
    </ul>
  );
}
const condition = (authUser) => authUser != null;

const AdminWithFirebase = withFirebase(AdminPage);

export default withAuthorization(condition)(AdminWithFirebase);
