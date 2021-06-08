import React, { useState } from "react";

import { GiTrashCan } from "react-icons/gi";
import { MdFavorite } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { IoShareSocial } from "react-icons/io5";

import { withFirebase } from "../Firebase";
import { withAuthorization, AuthUserContext } from "../Session";

class AdminPage extends React.Component {
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
      <div className="page__main-div admin-page">
        <h1 className="page-header">Admin</h1>

        {loading && <div>loading...</div>}

        <UserData firebase={firebase} user={user} loading={loading} />
      </div>
    );
  }
}

AdminPage.contextType = AuthUserContext;

function UserData({ user, firebase, loading }) {
  // Toggles true of false if user wants to see favorited images or all images
  const [showFavorites, setShowFavorites] = useState(false);

  // Have an object holding all user data that are objects(images holding their information)
  let imgData = [];

  // Loop through all keys, push any values that are objects
  for (let key in user) {
    const userValue = user[key];
    if (typeof userValue === "object" && userValue !== null) {
      imgData.push(userValue);
    }
  }

  // Filters and keeps all objects with a favorites key set to true(favorites key shows image is favorited)
  let favoritedImages = imgData.filter((img) => {
    return img.favorite;
  });

  // Toggles picture to favorite when clicked
  async function setToFavorite(pushid) {
    const userUid = user.uid;

    let isFavorite;

    // Access data and checks if there is a favorite key
    await firebase.user(userUid).on("value", (snapshot) => {
      const data = snapshot.val();

      // When item is deleted this reruns and error says can't read property favorite of undefined. This line prevents that error
      if (!data[pushid]) return;

      isFavorite = snapshot.val()[pushid].favorite;
    });

    // Access child in data and if key is true then remove key, else set to true
    const fbUser = await firebase.user(userUid).child(pushid);
    fbUser.update({
      favorite: isFavorite ? null : true,
    });

    setShowFavorites(showFavorites);
  }

  // Remove data from database and storage
  async function handleRemoveData(pushid) {
    try {
      const userUid = user.uid;
      const firebaseDatabaseUser = await firebase.user(userUid);
      const databaseDataToRemove = firebaseDatabaseUser.child(pushid);
      databaseDataToRemove.remove();

      const imageAsFile = user[pushid].imageAsFile;

      const firebaseStorageImg = await firebase
        .getUserImagesRef(userUid)
        .child(imageAsFile);

      setShowFavorites(showFavorites);

      firebaseStorageImg.delete();
    } catch (err) {
      console.error(err);
    }
  }

  // If no images in favoritedImages say no images else map through and show favorited images
  let displayFavoritedImages;

  // Map through ref with all favorited images to display if showFavorites is true
  if (favoritedImages.length <= 0) {
    displayFavoritedImages = (
      <p className="no-images">There are no favorited images.</p>
    );
  } else {
    displayFavoritedImages = favoritedImages.map((imgData) => {
      const { pushid, imageAsUrl, favorite } = imgData;

      return (
        <React.Fragment key={pushid}>
          <UserImage
            pushid={pushid}
            imageAsUrl={imageAsUrl}
            handleRemoveData={handleRemoveData}
            setToFavorite={setToFavorite}
            favorite={favorite}
          />
        </React.Fragment>
      );
    });
  }

  // Map through array of objects to display all images
  const displayAllImages = imgData.map((imgData) => {
    const { pushid, imageAsUrl, favorite } = imgData;

    return (
      <React.Fragment key={pushid}>
        <UserImage
          pushid={pushid}
          imageAsUrl={imageAsUrl}
          handleRemoveData={handleRemoveData}
          setToFavorite={setToFavorite}
          favorite={favorite}
        />
      </React.Fragment>
    );
  });

  return (
    <>
      {imgData.length > 0 ? (
        <>
          <div className="all-or-favorites-container">
            <button
              className={
                showFavorites ? "button" : "button button-color--reverse"
              }
              onClick={() => setShowFavorites(false)}
            >
              All Images
            </button>
            <button
              className={
                showFavorites ? "button button-color--reverse" : "button"
              }
              onClick={() => setShowFavorites(true)}
            >
              Favorites
            </button>
          </div>
          <ul className="admin__list">
            {showFavorites ? displayFavoritedImages : displayAllImages}
          </ul>
        </>
      ) : loading ? (
        <></>
      ) : (
        <p className="no-images">There are no photos uploaded here.</p>
      )}
    </>
  );
}

function UserImage({
  pushid,
  imageAsUrl,
  handleRemoveData,
  setToFavorite,
  favorite,
}) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  // Grabs the url of the photo and tells user to copy and paste to wherever they want it sent
  const shareImage = () => {
    setShowSharePopup(!showSharePopup);
  };

  return (
    <li className="admin__list-item" key={pushid}>
      <div
        style={{ backgroundImage: `url(${imageAsUrl})` }}
        alt="Uploaded img from user"
        className="admin-user__div-img"
        onClick={() => setShowFullImage(true)}
      >
        {favorite && <MdFavorite className="admin-user__img--favorite" />}
      </div>

      <div
        className={
          showFullImage ? "overlay-gallery--active" : "overlay-gallery"
        }
      >
        <div
          className={
            showSharePopup
              ? "overlay-share-popup--active"
              : "overlay-share-popup"
          }
        >
          <div className="overlay-share-content">
            <p className="overlay-share__p">
              Copy or click the link to go to the image and share the url with
              anyone to view the photo!
            </p>
            <a
              className="overlay-share__link"
              href={imageAsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {imageAsUrl}
            </a>
            <a
              href={imageAsUrl}
              target="_blank"
              rel="noreferrer"
              className="button overlay-share__button__link"
            >
              Go to image
            </a>
          </div>
        </div>

        <div
          className="overlay-image"
          style={{ backgroundImage: `url(${imageAsUrl})` }}
        >
          <div className="overlay-icons">
            <div className="overlay-icons--left">
              <AiOutlineClose
                className="overlay-exit overlay-icon"
                onClick={() => setShowFullImage(false)}
              />
            </div>
            <div className="overlay-icons--right">
              <IoShareSocial
                className="overlay-icon share-icon"
                onClick={() => shareImage(imageAsUrl)}
              />
              <MdFavorite
                className={
                  favorite
                    ? "overlay-icon favorite-icon is-favorite"
                    : "overlay-icon favorite-icon"
                }
                onClick={() => setToFavorite(pushid)}
              />
              <GiTrashCan
                className="overlay-icon trash-icon"
                onClick={() => handleRemoveData(pushid)}
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

const condition = (authUser) => authUser != null;

const AdminWithFirebase = withFirebase(AdminPage);

export default withAuthorization(condition)(AdminWithFirebase);
