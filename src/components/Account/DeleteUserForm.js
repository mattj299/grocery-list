import React, { useContext, useState } from "react";

import { withRouter } from "react-router-dom";

import { withFirebase } from "../Firebase";
import { AuthUserContext } from "../Session";

function DeleteUserForm(props) {
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const authUser = useContext(AuthUserContext);

  // Authenticed user uid and email
  const userUid = authUser.uid;
  const userEmail = authUser.email;

  function handlePasswordOneChange(event) {
    event.preventDefault();
    setPasswordOne(event.target.value);
  }

  function handlePasswordTwoChange(event) {
    event.preventDefault();
    setPasswordTwo(event.target.value);
  }

  async function onSubmit(event) {
    event.preventDefault();

    try {
      // Deletes authenticated user
      const authenticatedUser = await props.firebase.accessCurrentUser();
      authenticatedUser.delete();

      // Deletes storage images
      const firebaseStorageImages = await props.firebase.getUserImagesRef(
        userUid
      );
      const allImages = await firebaseStorageImages.listAll();
      allImages.items.forEach((item) => {
        item.delete();
      });

      // Deletes database data
      const firebaseDatabaseUser = await props.firebase.user(userUid);
      firebaseDatabaseUser.remove();

      props.history.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    passwordOne !== userEmail;

  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={handlePasswordOneChange}
        type="password"
        placeholder="Enter Email"
        className="form__input"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={handlePasswordTwoChange}
        type="password"
        placeholder="Confirm Email"
        className="form__input"
      />
      <button
        className={
          isInvalid
            ? "button form__button button--danger button--isInvalid"
            : "button form__button button--danger"
        }
        disabled={isInvalid}
        type="submit"
      >
        Delete Account
      </button>
    </form>
  );
}

export default withRouter(withFirebase(DeleteUserForm));
