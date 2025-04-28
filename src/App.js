import { useState } from "react";

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
  const [friends, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [addFriendButton, setAddFriendForm] = useState(true);
  const [splitBillFormOpen, setSplitBillFormOpen] = useState(false);

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectFriend={setSelectedFriend}
          splitBillFormOpen={setSplitBillFormOpen}
        />

        {addFriendButton && (
          <AddFriendButton
            addFriendButtonVisible={addFriendButton}
            onToggle={setAddFriendForm}
          />
        )}
        {addFriendButton || (
          <FormAddFriend
            addFriendButtonVisible={addFriendButton}
            onToggle={setAddFriendForm}
            updatedList={setFriendList}
          />
        )}
      </div>
      {selectedFriend && splitBillFormOpen && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          friends={friends}
          updatedList={setFriendList}
          splitBillFormOpen={setSplitBillFormOpen}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectFriend, splitBillFormOpen }) {
  return (
    <ul>
      {friends.map((friend, index) => (
        <Friend
          friend={friend}
          selectFriend={selectFriend}
          splitBillFormOpen={splitBillFormOpen}
          index={index}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectFriend, splitBillFormOpen, index }) {
  function selectedFriend(index) {
    splitBillFormOpen(true);
    selectFriend(index);
  }
  const { id, name, image, balance } = friend;

  return (
    <div>
      <li key={id}>
        <img alt={name} src={image} />
        <h3 id={name}>{name}</h3>
        {balance < 0 ? (
          <p className="red" key={id}>
            You owe {name} {Math.abs(balance)}$
          </p>
        ) : balance > 0 ? (
          <p className="green">
            {name} owes you {Math.abs(balance)}$
          </p>
        ) : (
          <p>You and {name} are even </p>
        )}

        <button
          className="button"
          value={index}
          onClick={(e) => selectedFriend(e.target.value)}
        >
          Select
        </button>
      </li>
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

// To be used in the future
// function Button({ children }) {
//   return <button className="button"> {children} </button>;
// }

function FormAddFriend({ addFriendButtonVisible, onToggle, updatedList }) {
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
        <label>👫Friend name</label>
        <input type="text" name="friendName" />
        <label>🖼️Image URL</label>
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

function FormSplitBill({
  selectedFriend,
  friends,
  updatedList,
  splitBillFormOpen,
}) {
  const [billValue, setBillValue] = useState("");
  const [myExpenses, setMyExpenses] = useState("");
  const [friendExpenses, setFriendsExpenses] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("1");

  const friend = friends[selectedFriend];
  const { name } = friend;

  function handleBillValue(data) {
    setBillValue(Number(data));
    setFriendsExpenses(Number(billValue - myExpenses));
  }

  function handleMyExpenses(data) {
    setMyExpenses(Number(data));
    setFriendsExpenses(Number(billValue - myExpenses));
  }

  function handleSelectedPayer(e) {
    e.preventDefault();
    setSelectedPayer(e.target.value);
  }

  function handleSplitBill(e) {
    e.preventDefault();
    const updatedBalance =
      selectedPayer === "1"
        ? Number(friends[selectedFriend].balance - friendExpenses)
        : Number(friends[selectedFriend].balance + myExpenses);

    friends[selectedFriend].balance = updatedBalance;

    updatedList(friends);
    // closing the split Bill form
    splitBillFormOpen(false);
  }

  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {name.toUpperCase()}</h2>
      <>
        <label>💰Bill value:</label>
        <input
          type="number"
          value={billValue}
          onChange={(e) => handleBillValue(Number(e.target.value))}
        ></input>
      </>
      <>
        <label>🧍Your expenses:</label>
        <input
          type="number"
          value={myExpenses}
          onChange={(e) => handleMyExpenses(e.target.value)}
        ></input>
      </>
      <>
        <label>👫{name}'s expenses:</label>
        <input type="text" value={friendExpenses} disabled></input>
      </>
      <>
        <label>🤑Who's paying the bill?</label>
        <select
          id="payer"
          value={selectedPayer}
          onChange={(e) => handleSelectedPayer(e)}
        >
          <option value="1">You</option>
          <option value="2">{name}</option>
        </select>
      </>
      <button className="button" onClick={(e) => handleSplitBill(e)}>
        Split bill
      </button>
    </form>
  );
}
