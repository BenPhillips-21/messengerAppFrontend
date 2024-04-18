import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import { formatDistanceToNow } from 'date-fns';


const Navbar = ({
  JWT,
  menu, setMenu, 
  chats, setChats, 
  chatID, setChatID, 
  currentUser, setCurrentUser, 
  allUsers, setAllUsers,
  currentChat, setCurrentChat,
  selectedChatImage, 
  chatName,
  userToGet, setUserToGet
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

  const handleMenuClick = (menuValue) => {
    setMenu(menuValue)
  }

  const fetchChat = () => {
    fetch(`http://localhost:3000/${chatID}`, options)
    .then(response => response.json())
    .then(data => setCurrentChat(data)) 
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
  }, [chatName, selectedChatImage])

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

  return (
    <>
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/home" className={styles.navLink}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/currentuser" className={styles.navLink}>Profile</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/sign-up" className={styles.navLink}>Sign Up</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/login" className={styles.navLink}>Login</Link>
        </li>
      </ul>
    </nav>
    { JWT &&
      <div className={styles.chatContainer}>
        <div className={styles.menu}>
          <button onClick={() => handleMenuClick("yourChats")}>Your Chats</button>
          <button onClick={() => handleMenuClick("otherUsers")}>Users</button>
        </div>
        {menu === "yourChats" ? chats.map((chat, index) => (
          <div onClick={() => handleChatClick(chat._id)} className={styles.messageCard} key={index}>
            <div className={styles.chatImage}>
              {chat.users.length > 2 ? <img src={chat.image.url}></img> : <img src={getInboundUserPfp(chat.users)}></img>}
            </div>
            <div className={styles.chatName}>
              <div className={styles.userNames}>
                {chat.chatName !== undefined ? <p>{chat.chatName}</p> : 
                chat.users.map((user, ind) => (
                  <div key={ind}>
                    {user.username !== currentUser ? <p>@{user.username}</p> : ''}
                  </div>
                ))}
              </div>
              {chat.messages.length > 0 ? <div className={styles.lastMsg}>
                <p>{chat.messages[chat.messages.length - 1].messageContent}</p>
              </div> : <p>No messages sent in this chat</p>}
            </div>
            {chat.messages.length > 0 ? <div className={styles.lastActiveContainer}>
              <p>Last Active: </p>
                <p>{formatDate(chat.messages[chat.messages.length - 1].dateSent)}</p>
            </div> : ''}
          </div>
        )) : 
          <div>
              {allUsers && allUsers.map((user) => (
                <li id={styles.usersToAddListItems} key={user._id}>
                  <Link to="/getuser" >
                    <div onClick={() => visitUser(user._id)} className={styles.userListLeft}>
                      <img src={user.profilePic.url} />
                      <p>{user.username}</p>
                    </div>
                  </Link>
                </li>
            ))}
          </div>
        }
      </div> 
      }
    </>
  );
}

export default Navbar;
