import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import { formatDistanceToNow } from 'date-fns';


const Navbar = ({
  JWT, setJWT,
  menu, setMenu, 
  chats, setChats, 
  chatID, setChatID, 
  currentUser, setCurrentUser, 
  allUsers, setAllUsers,
  currentChat, setCurrentChat,
  selectedChatImage, 
  chatName,
  userToGet, setUserToGet,
  chad, setChad,
  addUsers, setAddUsers,
  usersToAdd, setUsersToAdd,
  activeItem, setActiveItem
}) => {

  const navigate = useNavigate();

  const headers = {
    'Authorization': `Bearer ${JWT}`,
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'GET',
    headers: headers,
    mode: 'cors'
  };
  const createChatOptions = {
    method: 'POST',
    headers: headers,
    mode: 'cors'
  }

  const handleMenuClick = (menuValue) => {
    setMenu(menuValue)
  }

  const fetchChat = () => {
    fetch(`http://localhost:3000/${chatID}`, options)
      .then(response => response.json())
      .then(data => {
        setCurrentChat(data);
        if (data.chad.username === currentUser) {
          setChad(true);
        } else {
          setChad(false);
        }
      })
      .catch(error => console.error('Error fetching posts:', error));
  }
  

  useEffect(() => {
    fetchChat()
  }, [chatID])

  useEffect(() => {
    fetch('http://localhost:3000/allusers', options)
    .then(response => response.json())
    .then(data => setAllUsers(data)) 
    .catch(error => console.error('Error fetching posts:', error));
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/allchats', options)
    .then(response => response.json())
    .then(data => setChats(data)) 
    .catch(error => console.error('Error fetching posts:', error));
  }, [chatName, selectedChatImage, menu, chatID])

  useEffect(() => {
    fetch('http://localhost:3000/currentuser', options)
    .then(response => response.json())
    .then(data => setCurrentUser(data.username)) 
    .catch(error => console.error('Error fetching posts:', error));
  }, [])

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  const handleChatClick = (chatid) => {
    console.log(chatid)
    setChatID(chatid)
    setActiveItem(chatid);
    navigate('/home')
  }

const getInboundUserPfp = (chatUsersArray) => {
  for (let i = 0; i < chatUsersArray.length; i++) {
    if (chatUsersArray[i].username !== currentUser) {
      return chatUsersArray[i].profilePic.url
    }
  }
}

const visitUser = (userid) => {
  setUserToGet(userid)
}

const handleAddUsersClick = async () => {
  if (addUsers === false) {
    setAddUsers(true)
  } else {
    setAddUsers(false)
    setUsersToAdd([])
  }
}

const handleCheckToggle = (userID) => {
  if (!usersToAdd.includes(userID)) {
    usersToAdd.push(userID)
    setUsersToAdd(usersToAdd)
  } else {
    const filteredArray = usersToAdd.filter(item => item !== userID);
    setUsersToAdd(filteredArray)
  }
};

const addSelectedUsers = async () => {
  let gcID;

  await fetch(`http://localhost:3000/createchat/${usersToAdd[0]}`, createChatOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      gcID = data.chat._id;
    })
    .catch(error => console.error('Error creating chat', error));

  if (gcID) {
    for (let i = 1; i < usersToAdd.length; i++) {
      fetch(`http://localhost:3000/${gcID}/${usersToAdd[i]}/addtochat`, options)
        .then(response => response.json())
        .then(data => console.log(data)) 
        .catch(error => console.error('Error adding user:', error));
    }
  }
  setUsersToAdd([]);
  setAddUsers(false);
  setChatID(gcID)
  fetchChat();
};

  const handleLogout = () => {
    setJWT('')
    navigate('/login')
  }

  return (
    <>
    { JWT &&
      <div className={styles.chatContainer}>
        <div className={styles.menu}>
          <button onClick={() => handleMenuClick("yourChats")}>Your Chats</button>
          <button onClick={() => handleMenuClick("otherUsers")}>Start Chat</button>
          <button onClick={() => navigate('/currentuser')}>My Profile</button>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
        {menu === "yourChats" ? chats
        .sort((a, b) => {
          const dateA = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].dateSent) : new Date(0);
          const dateB = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].dateSent) : new Date(0);
          return dateB - dateA;
      })
        .map((chat, index) => (
          <div onClick={() => handleChatClick(chat._id)} className={activeItem === chat._id ? styles.activeMessageCard : styles.messageCard} key={index}>
            <div className={styles.chatImage}>
              {chat.users.length > 2 ? <img src={chat.image.url}></img> : <img src={getInboundUserPfp(chat.users)}></img>}
            </div>
            <div className={styles.chatName}>
              <div className={styles.userNames}>
              {chat.chatName !== undefined ? (
                <p>{chat.chatName}</p>
              ) : (
                <>
                  {chat.users.slice(0, 2).map((user, ind) => (
                    <div key={ind}>
                      {user.username !== currentUser ? (
                        <p>@{user.username}</p>
                      ) : ''}
                    </div>
                  ))}
                  {chat.users.length > 2 && (
                    <div>
                      <p>@{chat.users[2].username}</p>
                    </div>
                  )}
                  {chat.users.length > 3 && (
                    <div>
                      <p>...</p>
                    </div>
                  )}
                </>
              )}
              </div>
              {chat.messages.length > 0 ? <div className={styles.lastMsg}>
                {chat.messages[chat.messages.length - 1].messageContent === "" ? 
                <p>{chat.messages[chat.messages.length - 2].messageContent.slice(0, 30)}</p> :
                <p>{chat.messages[chat.messages.length - 1].messageContent.slice(0, 30)}</p>}
              </div> : <p>No messages sent in this chat</p>}
            </div>
            {chat.messages.length > 0 ? <div className={styles.lastActiveContainer}>
              <p>Last Active: </p>
                <p>{formatDate(chat.messages[chat.messages.length - 1].dateSent)}</p>
            </div> : ''}
          </div>
        )) : 
          <div>
              {<button id={styles.userListLeftButtons} onClick={() => handleAddUsersClick()}>Start Group Chat</button>}
              {addUsers === true ? <div className={styles.addUsersList}>
                {allUsers && allUsers.map((user) => ((
                      <li id={styles.usersToAddListItems} key={user._id}>
                        <label>
                          {user.username}
                          <input
                            type="checkbox"
                            onChange={() => handleCheckToggle(user._id)}
                          />
                        </label>
                      </li>
                    )
                  ))}
                <button id={styles.userListLeftButtons} onClick={() => addSelectedUsers()}>Add Selected Users</button>
              </div> : ''}
              <div className={styles.userProfiles}>
                {addUsers === false && <h3>User Profiles: </h3>}
                {addUsers === false && allUsers && allUsers.map((user) => (
                  <li id={styles.usersToAddListItems} key={user._id}>
                    <Link to="/getuser" >
                      <div onClick={() => visitUser(user._id)} className={styles.userListLeft}>
                        <img src={user.profilePic.url} />
                        <p>@{user.username}</p>
                      </div>
                    </Link>
                  </li>
              ))}
            </div>
          </div>
        }
      </div> 
      }
    </>
  );
}

export default Navbar;
