import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/home.module.css';

const Home = ({JWT, setJWT}) => {
  console.log(JWT)
  const [chats, setChats] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [chatID, setChatID] = useState()
  const [chatContent, setChatContent] = useState()

  const headers = {
    'Authorization': `Bearer ${JWT}`,
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'GET',
    headers: headers,
    mode: 'cors'
  };

  useEffect(() => {
    fetch(`http://localhost:3000/${chatID}`, options)
    .then(response => response.json())
    .then(data => setChatContent(data)) 
    .catch(error => console.error('Error fetching posts:', error));
  }, [chatID])

  useEffect(() => {
    fetch('http://localhost:3000/allchats', options)
    .then(response => response.json())
    .then(data => setChats(data)) 
    .catch(error => console.error('Error fetching posts:', error));
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/currentuser', options)
    .then(response => response.json())
    .then(data => setCurrentUser(data.username)) 
    .catch(error => console.error('Error fetching posts:', error));
  }, [])

  console.log(chats)
  console.log(currentUser, 'le current user')
  console.log(chatContent)

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  const handleChatClick = (chatid) => {
    console.log(chatid)
    setChatID(chatid)
  }

  return (
    <>
      <div className={styles.fatherContainer}>
      <div className={styles.chatContainer}>
        {chats.map((chat, index) => (
          <div onClick={() => handleChatClick(chat._id)} className={styles.messageCard} key={index}>
            <div className={styles.chatName}>
              <div className={styles.userNames}>
                {chat.users.map((user, ind) => (
                  <div key={ind}>
                    {user.username !== currentUser ? <p>@{user.username}</p> : ''}
                  </div>
                ))}
              </div>
              <div className={styles.lastMsg}>
                <p>{chat.messages[chat.messages.length - 1].messageContent}</p>
              </div>
            </div>
            <div className={styles.lastActiveContainer}>
              <p>Last Active: </p>
              <p>{formatDate(chat.messages[chat.messages.length - 1].dateSent)}</p>
            </div>
          </div>
        ))}
      </div>
        <div className={styles.messagesContainer}>
          <p>Messages</p>
          <p>More messages....</p>
        </div>
      </div>
    </>
  );
}

export default Home;
