import React, { useContext, useEffect, useState } from "react";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { AiOutlineClose, AiOutlineCheck, AiFillEdit } from "react-icons/ai";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// data set up for grocery list
const initialGrocery = {
  storeNames: [],
  food: [],
  amount: [],
  completed: [],
};

const initialNewFoodItems = {
  storeName: "",
  food: [],
  amount: [],
  error: false,
};

function Home() {
  return <HomeGroceryWithFirebase />;
}

function HomeGroceryForm(props) {
  const [data, setData] = useState(initialGrocery);
  const [showNewGroceryListInputs, setShowNewGroceryListInputs] =
    useState(false);

  const [newFoodItems, setNewFoodItems] = useState(initialNewFoodItems);
  const [loadingData, setLoadingData] = useState(true);

  const displayNewGroceryListInputs = () => {
    setShowNewGroceryListInputs(true);
  };

  const hideNewGroceryListInputs = () => {
    setShowNewGroceryListInputs(false);
  };

  // Authorized user context
  const authUser = useContext(AuthUserContext);
  const authUserUid = authUser.uid;

  useEffect(() => {
    props.firebase.user(authUser.uid).on("value", (snapshot) => {
      const userObject = snapshot.val();

      const savedFoodItems = userObject.item;

      if (savedFoodItems) setData(userObject.item);

      setLoadingData(false);
    });
  }, []);

  // toastify notification
  const toastifyNotification = (notificationText) => {
    toast(notificationText, {
      theme: "dark",
      autoClose: 2000,
    });

    // removes toast queue if exists
    toast.clearWaitingQueue();
  };

  const onNewGroceryListInputChange = (e) => {
    const newInputData = e.target.value;

    setNewFoodItems({ ...newFoodItems, storeName: newInputData });
  };

  const onInputChange = (e, listIndex, itemIndex) => {
    // changing food item
    const newInputData = e.target.value;

    if (e.target.name == "food") {
      let newFood = [...data.food];

      newFood[listIndex][itemIndex] = newInputData;

      setData({ ...data, food: newFood });
    }
    // changing amount
    else if (e.target.name == "amount") {
      let newAmounts = [...data.amount];

      newAmounts[listIndex][itemIndex] = parseInt(newInputData);

      setData({ ...data, amount: newAmounts });
    }
    // changing storeName
    else {
      let newStoreName = [...data.storeNames];

      newStoreName[listIndex] = newInputData;

      setData({ ...data, storeNames: newStoreName });
    }
  };

  const focusOnCurrentStoreName = (listIndex) => {
    const activeStoreName = document.getElementsByClassName(
      "grocery-list-name-input"
    )[listIndex];

    activeStoreName.focus();
  };

  const createNewGroceryList = (e) => {
    e.preventDefault();

    const newStoreName = newFoodItems.storeName;
    const newFood = newFoodItems.food;
    const newAmount = parseInt(newFoodItems.amount);
    const newCompleted = false;

    if (!newStoreName || !newFood) {
      setNewFoodItems({ ...newFoodItems, error: true });
      return;
    }

    let storeNames = data.storeNames;
    let food = data.food;
    let amount = data.amount;
    let completed = data.completed;

    // make it so you can add whatever name you want and food item(s) so you can then push into firebase as opposed to hard coding something like target.
    storeNames.push(newStoreName);
    food.push([newFood]);
    amount.push([newAmount]);
    completed.push([newCompleted]);

    toastifyNotification("New Grocery List Created!");

    setShowNewGroceryListInputs(false);
    setData({ storeNames, food, amount, completed });
  };

  const addGroceryItem = (e, listIndex) => {
    const newFood = [...data.food[listIndex]];
    const newAmount = [...data.amount[listIndex]];
    const newCompleted = [...data.completed[listIndex]];

    newFood.push("");
    newAmount.push(0);
    newCompleted.push(false);

    // if index matches listIndex in data array then return new updated array else return untouched arrays
    const updatedFood = data.food.map((foodItem, index) => {
      if (index == listIndex) return newFood;
      return foodItem;
    });

    const updatedAmount = data.amount.map((amountItem, index) => {
      if (index == listIndex) return newAmount;
      return amountItem;
    });

    const updatedCompleted = data.completed.map((completedItem, index) => {
      if (index == listIndex) return newCompleted;
      return completedItem;
    });

    toastifyNotification("New Item Added to List!");

    setData({
      ...data,
      food: updatedFood,
      amount: updatedAmount,
      completed: updatedCompleted,
    });
  };

  const deleteGroceryList = async (listIndex) => {
    let storeNames = data.storeNames;
    let food = data.food;
    let amount = data.amount;
    let completed = data.completed;

    const newStoreName = storeNames.filter((item, index) => {
      return index != listIndex;
    });

    const newFood = food.filter((item, index) => {
      return index != listIndex;
    });

    const newAmount = amount.filter((item, index) => {
      return index != listIndex;
    });

    const newCompleted = completed.filter((item, index) => {
      return index != listIndex;
    });

    toastifyNotification("Successfully deleted.");

    setData({
      storeNames: newStoreName,
      food: newFood,
      amount: newAmount,
      completed: newCompleted,
    });
  };

  const deleteGroceryItem = (listIndex, listItemIndex) => {
    const newFood = [...data.food[listIndex]];
    const newAmount = [...data.amount[listIndex]];
    const newCompleted = [...data.completed[listIndex]];

    if (newFood.length == 1) {
      toastifyNotification("Delete list in order to delete item.");
      return;
    }

    newFood.splice(listItemIndex, 1);
    newAmount.splice(listItemIndex, 1);
    newCompleted.splice(listItemIndex, 1);

    // // if index matches listIndex in data array then return new updated array else return untouched arrays
    const updatedFood = data.food.map((foodItem, index) => {
      if (index == listIndex) return newFood;
      return foodItem;
    });

    const updatedAmount = data.amount.map((amountItem, index) => {
      if (index == listIndex) return newAmount;
      return amountItem;
    });

    const updatedCompleted = data.completed.map((completedItem, index) => {
      if (index == listIndex) return newCompleted;
      return completedItem;
    });

    toastifyNotification("Deleted Item from List!");

    setData({
      ...data,
      food: updatedFood,
      amount: updatedAmount,
      completed: updatedCompleted,
    });
  };

  const completeGroceryItem = (e, listIndex, itemIndex) => {
    let itemChanging = data.completed[listIndex][itemIndex];

    // if grocery item is already completed (true) then set it to false and change state, vice versa if it is not completed (false)
    if (itemChanging == true) {
      itemChanging = false;
      let newCompleted = [...data.completed];
      newCompleted[listIndex][itemIndex] = itemChanging;
      setData({ ...data, completed: newCompleted });
    } else {
      itemChanging = true;
      let newCompleted = [...data.completed];
      newCompleted[listIndex][itemIndex] = itemChanging;
      setData({ ...data, completed: newCompleted });
    }
  };

  const onFirebaseSubmit = async (e) => {
    e.preventDefault();

    try {
      await props.firebase.updateGroceryToDatabase(authUserUid, data);
      toastifyNotification("Lists Saved!");
    } catch (err) {
      console.error(err);
      console.log("error in submit to firebase function");
    }
  };

  // saves data to firebase when user leaves page by either closing page or reload
  window.addEventListener("beforeunload", (e) => {
    onFirebaseSubmit(e);
  });

  return (
    <div className="home">
      <ToastContainer limit="3" />
      {showNewGroceryListInputs && (
        <div className="home-new-grocery-list">
          <div className="home-new-grocery-list-wrapper">
            <AiOutlineClose
              className="home-new-grocery-list-close"
              onClick={hideNewGroceryListInputs}
            />

            <form
              className="home-new-grocery-list-input-form"
              onSubmit={createNewGroceryList}
            >
              <div className="home-new-grocery-list-input-content">
                <h2 style={{ padding: "10px 0" }}>New Store Name</h2>
                <input
                  className="home-new-grocery-list-input"
                  type="text"
                  name="storeName"
                  maxLength="10"
                  autoFocus
                  onChange={onNewGroceryListInputChange}
                  autoComplete="off"
                />
              </div>

              <button
                className="grocery-list-button home-new-grocery-list-button button"
                type="submit"
              >
                Submit
              </button>

              {newFoodItems.error && (
                <p>All inputs need to be filled out to submit.</p>
              )}
            </form>
          </div>
        </div>
      )}
      <div className="home-lists-container">
        {loadingData && <p>Loading...</p>}
        {!loadingData && (
          <>
            <div className="grocery-lists">
              {/* maps through all names which correspond to each list that will be made  */}
              {data.storeNames.map((storeName, listIndex) => {
                return (
                  <div className="grocery-list">
                    <div className="grocery-list-no-add-button-content">
                      <div className="grocery-list-header-content">
                        <AiFillEdit
                          className="grocery-list-edit"
                          onClick={() => focusOnCurrentStoreName(listIndex)}
                        />
                        <input
                          value={data.storeNames[listIndex]}
                          className="grocery-list-name-input"
                          name="storeName"
                          maxLength="10"
                          autoComplete="off"
                          onChange={(e) => onInputChange(e, listIndex)}
                        />
                        <AiOutlineClose
                          onClick={() => deleteGroceryList(listIndex)}
                          className="grocery-list-delete"
                        />
                      </div>

                      <div className="grocery-list-inputs-labels">
                        <h5 className="grocery-list-input-label">Food</h5>
                        <h5 className="grocery-list-input-label">Amount</h5>
                      </div>

                      {/* maps through each item in food and amount and creates an input w/ up & down arror to change input */}
                      {data.food[listIndex].map((item, itemIndex) => {
                        return (
                          <div className="grocery-item">
                            <input
                              style={
                                data.completed[listIndex][itemIndex]
                                  ? {
                                      textDecoration: "line-through",
                                      textDecorationThickness: "3px",
                                    }
                                  : {}
                              }
                              className="list-item-input item-name"
                              name="food"
                              autoComplete="off"
                              type="text"
                              value={item}
                              // focuses on the input when addGroceryItem gets called
                              autoFocus
                              onChange={(e) =>
                                onInputChange(e, listIndex, itemIndex)
                              }
                            />

                            <input
                              style={
                                data.completed[listIndex][itemIndex]
                                  ? {
                                      borderLeft: "1px solid white",
                                      textDecoration: "line-through",
                                      textDecorationThickness: "3px",
                                    }
                                  : { borderLeft: "1px solid white" }
                              }
                              className="list-item-input item-amount"
                              name="amount"
                              type="number"
                              value={data.amount[listIndex][itemIndex]}
                              onChange={(e) =>
                                onInputChange(e, listIndex, itemIndex)
                              }
                            />
                            <AiOutlineCheck
                              onClick={(e) =>
                                completeGroceryItem(e, listIndex, itemIndex)
                              }
                              className="grocery-item-check grocery-item-extra"
                            />
                            <AiOutlineClose
                              onClick={() =>
                                deleteGroceryItem(listIndex, itemIndex)
                              }
                              className="grocery-item-delete grocery-item-extra"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="grocery-list-add-item grocery-list-button button"
                      onClick={(e) => addGroceryItem(e, listIndex)}
                    >
                      Add New Item
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="grocery-list-outside-list-buttons">
              <button
                className="grocery-list-add-new-list grocery-list-button button"
                onClick={displayNewGroceryListInputs}
              >
                Add New Grocery List
              </button>

              <button
                className="grocery-list-save-lists grocery-list-button button"
                onClick={(e) => onFirebaseSubmit(e)}
              >
                Save Lists
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const HomeGroceryWithFirebase = withFirebase(HomeGroceryForm);

const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(Home);
