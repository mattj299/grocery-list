import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import App from "./components/App";
import Firebase, { FirebaseContext } from "./components/Firebase";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// Reminder: Don't think "how can I create this". Think "how can I create and maintain this for future use."

// Do one objective at a time. Break it down to simpler pieces.

// Project is a photo/video library.
// !!! User needs to authenticate first in order to get into their account so their needs to be a sign in and out
// !!! Just add some text to the database on user that is authenticated. Ex would be just like the username: username. User adds own header and text
// !!! Display data/text correctly. Ex. Display header/text under user that wrote the data/text
// !!! Only see data for user that is signed in, for example in admin page only see that users email, username, etc not all users
// !!! User should be able to also remove whatever text was added

// User should be able to upload phot/vids via files or link, idk how we'll find out, add as many as wanted, or until no space on fb. Potentially with a caption,

// Extra, potential advanced features
// If all goes well user as well can then upload these photos/videos to their social media of choice with captions and such.

// Honestly idk if I can do this or if this is even all front end but again as said, you gotta get out of your comfort zone and make a big project.
// All you Matt.
