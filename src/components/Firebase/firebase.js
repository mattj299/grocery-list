import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  accessCurrentUser = () => this.auth.currentUser;

  // *** Database API ***
  // ** Accessing users from database **
  user = (uid) => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  // ** CRUD functionality to database **
  updateGroceryToDatabase = (uid, item) => this.user(uid).update({ item });

  deleteGroceryItemFromDatabase = (uid, item) =>
    this.user(uid).update({ item });

  // *** Storage API ***
  addImageToUserStorage = (userUid, imageAsFile) =>
    this.storage.ref(`/images/${userUid}/${imageAsFile.name}`).put(imageAsFile);

  getUserImagesRef = (userUid) => this.storage.ref(`images/${userUid}`);
}

export default Firebase;
