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
  const [listOfFriends, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [addFriendButton, setAddFriendForm] = useState(true);
  const [splitBillFormOpen, setSplitBillFormOpen] = useState(false);

  return (
    <div className="app">
      <Friends
        listOfFriends={listOfFriends}
        selectFriend={setSelectedFriend}
        splitBillFormOpen={setSplitBillFormOpen}
      />
      {selectedFriend && splitBillFormOpen && (
        <BillCalculations
          selectedFriend={selectedFriend}
          list={listOfFriends}
          updatedList={setFriendList}
          splitBillFormOpen={setSplitBillFormOpen}
        />
      )}
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
          updatedList={setFriendList}
        />
      )}
    </div>
  );
}

function Friends({ listOfFriends, selectFriend, splitBillFormOpen }) {
  return (
    <ul className="sidebar">
      <FriendProfile
        listOfFriends={listOfFriends}
        selectFriend={selectFriend}
        splitBillFormOpen={splitBillFormOpen}
      />
    </ul>
  );
}

function FriendProfile({ listOfFriends, selectFriend, splitBillFormOpen }) {
  function selectedFriend(index) {
    splitBillFormOpen(true);
    selectFriend(index);
  }

  return (
    <div>
      {listOfFriends.map((profile, index) => {
        const { id, name, image, balance } = profile;
        return (
          <li key={id} className="sidebar">
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

            <button
              className="button"
              value={index}
              onClick={(e) => selectedFriend(e.target.value)}
            >
              Select
            </button>
          </li>
        );
      })}
    </div>
  );
}

function AddFriendButton({ addFriendButtonVisible, onToggle }) {
  return (
    <button
      className="button sidebar"
      onClick={() => onToggle(!addFriendButtonVisible)}
    >
      Add friend
    </button>
  );
}

function AddFriendForm({ addFriendButtonVisible, onToggle, updatedList }) {
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
        <div>👫Friend name</div>
        <input type="text" name="friendName" />
        <div>🖼️Image URL</div>
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

function BillCalculations({
  selectedFriend,
  list,
  updatedList,
  splitBillFormOpen,
}) {
  const [billValue, setBillValue] = useState("");
  const [myExpenses, setMyExpenses] = useState("");
  const [friendExpenses, setFriendsExpenses] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("1");

  const friend = list[selectedFriend];
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
        ? Number(list[selectedFriend].balance - friendExpenses)
        : Number(list[selectedFriend].balance + myExpenses);

    list[selectedFriend].balance = updatedBalance;

    updatedList(list);
    // closing the split Bill form
    splitBillFormOpen(false);
  }

  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {name.toUpperCase()}</h2>
      <>
        <h4>💰Bill value:</h4>
        <input
          type="number"
          value={billValue}
          onChange={(e) => handleBillValue(Number(e.target.value))}
        ></input>
      </>
      <>
        <h4>🧍Your expenses:</h4>
        <input
          type="number"
          value={myExpenses}
          onChange={(e) => handleMyExpenses(e.target.value)}
        ></input>
      </>
      <>
        <h4>👫{name}'s expenses:</h4>
        <input
          type="text"
          value={friendExpenses}
          id="friend-expenses"
          readOnly
        ></input>
      </>
      <>
        <h4>🤑Who's paying the bill?</h4>
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
