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

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [currentFriendsList, setCurrentFriendsList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [splitBillFormOpen, setSplitBillFormOpen] = useState(false);

  function handleShowAddFriend() {
    // Handle the state of the "Add Friend" Form
    setShowAddFriendForm(!showAddFriendForm);
  }

  function handleSelectedFriend(friend) {
    // If current selected friend is the samilar to the one selected - we disable selection
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));

    setShowAddFriendForm(false);
    // If a friend is selected, the Split Bill Form is opened
    setSplitBillFormOpen(friend ? true : false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          currentFriendsList={currentFriendsList}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriendForm && (
          <FormAddFriend
            showAddFriendForm={showAddFriendForm}
            onToggle={setShowAddFriendForm}
            setCurrentFriendsList={setCurrentFriendsList}
          />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && splitBillFormOpen && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          splitBillFormOpen={splitBillFormOpen}
        />
      )}
    </div>
  );
}

function FriendsList({ currentFriendsList, onSelection, selectedFriend }) {
  return (
    <ul>
      {currentFriendsList.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  const { id, name, image, balance } = friend;

  return (
    <div>
      <li key={id} className={isSelected ? "selected" : ""}>
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

        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function FormAddFriend({ showAddFriendForm, onToggle, setCurrentFriendsList }) {
  const [newFriendsName, setNewFriendsName] = useState("");
  const [newFriendsImage, setNewFriendsImage] = useState(
    "https://i.pravatar.cc/48?u="
  );

  function handleAddFriend(e) {
    // Prevent re-load of the whole page
    e.preventDefault();

    // Validating creation of a name and image for a new friend
    if (!newFriendsName || !newFriendsImage) return;

    // Generate ID for a new friend
    const newFriendsId = crypto.randomUUID();

    // Creating a record for a new friend
    const newFriend = {
      id: newFriendsId,
      // new Date().getTime().toString() - other possible way of making a unique record id
      name: newFriendsName,
      image: `${newFriendsImage}${newFriendsId}`,
      balance: 0,
    };

    // Updating the list of friends
    setCurrentFriendsList((currentList) => [...currentList, newFriend]);

    // Closing the "Add Friend" Form
    onToggle(!showAddFriendForm);
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={(e) => handleAddFriend(e)}>
        <label>👫Friend name</label>
        <input
          type="text"
          value={newFriendsName}
          onChange={(e) => setNewFriendsName(e.target.value)}
        />
        <label>🖼️Image URL</label>
        <input
          type="text"
          value={newFriendsImage}
          onChange={(e) => setNewFriendsImage(e.target.value)}
        />

        <button className="button" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

function FormSplitBill({
  selectedFriend,
  setSelectedFriend,
  splitBillFormOpen,
}) {
  const [billValue, setBillValue] = useState("");
  const [myExpenses, setMyExpenses] = useState("");
  const [friendExpenses, setFriendsExpenses] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("1");

  const { name } = selectedFriend;

  // Handling the input of Bill Value
  function handleBillValue(data) {
    setBillValue(Number(data));
    setFriendsExpenses(Number(billValue - myExpenses));
  }

  // Handling the input of my expenses
  function handleMyExpenses(data) {
    setMyExpenses(Number(data));
    setFriendsExpenses(Number(billValue - myExpenses));
  }

  // Handling the selection of a Payer
  function handleSelectedPayer(e) {
    e.preventDefault();
    setSelectedPayer(e.target.value);
  }

  // Splitting the bill
  function handleSplitBill(e) {
    console.log(e);
    // Preventing re-loading the whole page
    e.preventDefault();

    const updatedBalance =
      selectedPayer === "1"
        ? Number(selectedFriend.balance - friendExpenses)
        : Number(selectedFriend.balance + myExpenses);

    selectedFriend.balance = updatedBalance;

    // Closing the "Split Bill" Form after the billis split
    splitBillFormOpen(false);
    setSelectedFriend(null);
  }

  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {name}</h2>
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
        <select id="payer" onChange={(e) => handleSelectedPayer(e)}>
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
