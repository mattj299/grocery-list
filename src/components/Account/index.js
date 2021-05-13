import React from "react";

import { AuthUserContext, withAuthorization } from "../Session";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

function AccountPage() {
  return (
    <AuthUserContext.Consumer>
      {(authUser) => {
        return (
          <div>
            <h1>Account: {authUser.email}</h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        );
      }}
    </AuthUserContext.Consumer>
  );
}

const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(AccountPage);
