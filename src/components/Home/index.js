import React, { useContext, useReducer, useState } from "react";

import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

function HomePage() {
  return (
    <div className="page__main-div">
      <h1 className="page-header">Home Page</h1>
      <p className="page__desc">Here you can upload your photos.</p>
      <UploadToFirebase />
    </div>
  );
}

// Gives data to database
const initialState = {
  imageAsUrl: "",
  imageAsFile: "",
  uploading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "IMAGE_AS_FILE":
      return {
        ...state,
        imageAsFile: action.payload,
      };
    case "IMAGE_AS_URL":
      return {
        ...state,
        imageAsUrl: action.payload,
      };
    case "UPLOADING":
      return {
        ...state,
        uploading: action.payload,
      };
    default:
      return initialState;
  }
}

function UploadToFirebaseForm(props) {
  // State to track progress of image upload
  const [imageUploadProgress, setImageUploadProgress] = useState();

  // Authorized user context
  const authUser = useContext(AuthUserContext);
  const authUserUid = authUser.uid;

  // Instead of having multiple useStates instead use useReducer with type and payload
  const [state, dispatch] = useReducer(reducer, initialState);
  const { imageAsUrl, imageAsFile, uploading } = state;

  async function handleImageAsFile(e) {
    const chosenImage = e.target.files[0];

    // Line checks if chosenImage exists. If undefined then simply return to end the function
    if (!chosenImage) return;

    dispatch({ type: "IMAGE_AS_FILE", payload: chosenImage });

    const chosenImageName = chosenImage.name;

    const allImagesRef = await props.firebase
      .getUserImagesRef(authUserUid)
      .listAll();

    allImagesRef.items.forEach((image) => {
      if (image.name === chosenImageName) {
        dispatch({ type: "IMAGE_AS_FILE", payload: "" });

        alert(
          "Image is already in the library, please do not upload duplicate image names. If you would like to do that then please change the name of the image."
        );

        const imageFileInput = document.getElementsByClassName(
          "home-form-file__input"
        )[0];
        imageFileInput.value = null;
      }
    });
  }

  async function handleFirebaseUpload(e) {
    e.preventDefault();

    if (imageAsFile === "") {
      return console.error(
        `not an image, the image file is a ${typeof imageAsFile}`
      );
    }

    // Uploads image to firebase, retrieves url that firebase produces, then sets the url to state so image can be displayed
    try {
      dispatch({ type: "UPLOADING", payload: true });

      const newImageAsFile = imageAsFile;
      const imageFileInput = document.getElementsByClassName(
        "home-form-file__input"
      )[0];
      imageFileInput.value = null;
      imageFileInput.disabled = true;

      dispatch({ type: "IMAGE_AS_FILE", payload: "" });

      await props.firebase
        .addImageToUserStorage(authUserUid, newImageAsFile)
        .on(
          "state_changed",
          (snapshot) => {
            // Updates progress of image upload and rounds number to nearest whole number
            let progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setImageUploadProgress(progress);
          },
          (error) => {
            console.error(error);
            console.log("error in uploadImage");
          },
          // This runs when progess bar is successful and hits 100%
          async () => {
            const firebaseUrl = await props.firebase
              .getUserImagesRef(authUserUid)
              .child(newImageAsFile.name)
              .getDownloadURL();

            dispatch({ type: "IMAGE_AS_URL", payload: firebaseUrl });

            // Adds users caption to database with the key for the object pushes url of image as well
            const newDataRef = await props.firebase.user(authUserUid).push();
            const key = newDataRef.key;
            newDataRef.set({
              imageAsUrl: firebaseUrl,
              imageAsFile: newImageAsFile.name,
              pushid: key,
            });

            dispatch({ type: "UPLOADING", payload: false });
            imageFileInput.disabled = false;
          }
        );
    } catch (err) {
      console.error(err);
      console.log("error in entire function");
      const imageFileInput = document.getElementsByClassName(
        "home-form-file__input"
      )[0];
      imageFileInput.disabled = false;
      dispatch({ type: "UPLOADING", payload: false });
    }
  }

  const isInvalid = imageAsFile === "";

  return (
    <>
      <form className="form" onSubmit={handleFirebaseUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageAsFile}
          className="home-form-file__input form__input"
        />
        <button
          className={
            isInvalid
              ? "button form__button button--isInvalid"
              : "button form__button"
          }
          disabled={isInvalid}
        >
          Upload to Firebase
        </button>
      </form>
      {uploading && <p>Upload is {imageUploadProgress}% done</p>}
      {uploading && <p className="uploading__p">Uploading image...</p>}
      <div
        style={{ backgroundImage: `url(${imageAsUrl})` }}
        className="home-user__div__img"
      ></div>
    </>
  );
}

const UploadToFirebase = withFirebase(UploadToFirebaseForm);

const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(HomePage);
