import React, { useContext } from "react";

import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

import PasswordChangeForm from "./PasswordChangeForm";
import DeleteUserForm from "./DeleteUserForm";

function AccountPage(props) {
  const authUser = useContext(AuthUserContext);

  return (
    <div className="page__main-div">
      <h1 className="page-header">Account Page</h1>
      <p className="page__desc">Account: {authUser.email}</p>

      <p className="page__desc">Change Password?</p>
      <PasswordChangeForm />

      <h1 className="page-header">Delete Account!</h1>
      <p className="page__desc">
        Deleting account will delete <strong>everything</strong> to do with the
        account! There is no going back.
      </p>

      <p className="page__desc">
        Enter your email and re-enter email to confirm deletion of account.
      </p>
      <DeleteUserForm />
    </div>
  );
}

const condition = (authUser) => authUser != null;

export default withFirebase(withAuthorization(condition)(AccountPage));
