import { useState } from "react";
import DateTimePicker from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [listOfFriends, setFriendList] = useState(initialFriends);
  const [addFriendButton, setAddFriendForm] = useState(true);

  return (
    <div className="app">
      <Friends list={listOfFriends} />
      {addFriendButton && (
        <AddFriendButton
          addFriendButtonVisible={addFriendButton}
          onToggle={setAddFriendForm}
        />
      )}
      {addFriendButton || (
        <AddFriendForm
          addFriendButtonVisible={addFriendButton}
          onToggle={setAddFriendForm}
          currentList={listOfFriends}
          updatedList={setFriendList}
        />
      )}
      <BillCalculations />
    </div>
  );
}

function Friends({ list }) {
  return (
    <ul className="sidebar">
      <FriendProfile list={list} />
    </ul>
  );
}

function FriendProfile({ list }) {
  return (
    <div>
      {list.map((profile) => {
        const { id, name, image, balance } = profile;
        return (
          <li key={id}>
            <img alt={name} src={image} />
            <h3 id={name}>{name}</h3>
            {balance > 0 ? (
              <p className="red" key={id}>
                You owe {name} {Math.abs(balance)}$
              </p>
            ) : balance < 0 ? (
              <p className="green">
                {name} owes you {Math.abs(balance)}$
              </p>
            ) : (
              <p>You and {name} are even </p>
            )}

            <button className="button"> Select </button>
          </li>
        );
      })}
    </div>
  );
}

function AddFriendButton({ addFriendButtonVisible, onToggle }) {
  return (
    <button
      className="button"
      onClick={() => onToggle(!addFriendButtonVisible)}
    >
      Add friend
    </button>
  );
}

function AddFriendForm({
  addFriendButtonVisible,
  onToggle,
  currentList,
  updatedList,
}) {
  function handleAddFriend(event) {
    updatedList((currentList) => [
      ...currentList,
      {
        id: new Date().getTime().toString(),
        name: event.target[0].value,
        image: event.target[1].value,
        balance: 0,
      },
    ]);

    onToggle(!addFriendButtonVisible);
  }
  return (
    <div>
      <form className="form-add-friend" onSubmit={(e) => handleAddFriend(e)}>
        <div>Friend name</div>
        <input type="text" name="friendName" />
        <div>Image URL</div>
        <input type="text" name="friendImageUrl" />
        <button className="button" type="submit">
          Add
        </button>
      </form>

      <button
        className="button"
        onClick={() => onToggle(!addFriendButtonVisible)}
      >
        Close
      </button>
    </div>
  );
}

function BillCalculations() {
  return (
    <form className="form-split-bill">
      Split a bill with Anthony
      <button className="button"> Split bill </button>
    </form>
  );
}
