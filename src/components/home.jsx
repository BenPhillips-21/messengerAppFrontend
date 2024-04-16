import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/home.module.css';

const Home = ({JWT, setJWT}) => {
  const [chats, setChats] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [chatID, setChatID] = useState()
  const [currentChat, setCurrentChat] = useState()
  const [newMessageContent, setNewMessageContent] = useState('')

  const headers = {
    'Authorization': `Bearer ${JWT}`,
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'GET',
    headers: headers,
    mode: 'cors'
  };

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
  console.log(currentChat, "LE CURRENT CHAT")

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  const handleChatClick = (chatid) => {
    console.log(chatid)
    setChatID(chatid)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let messageContent = newMessageContent
    const newPost = { messageContent }
    try {
        const response = await fetch(`http://localhost:3000/${chatID}/sendmessage`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${JWT}`
            },
            body: JSON.stringify(newPost)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData}`);
          }  

        setNewMessageContent('')
        fetchChat()
    } catch (err) {
        throw new Error(`${err}`);
    }
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
                {/* The last message does't display if it is an image */}
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
        <div className={styles.chatHeader}>
          <p>Bello</p>
        </div>
        {currentChat !== undefined && currentChat.messages.map((message, index) => (
        <div className={styles.userMessage} key={index}>
          <div className={message.writer.username !== currentUser ? styles.msgInfoInbound : styles.msgInfoOutbound}>
            <p>{message.writer.username}</p>
            <p>{formatDate(message.dateSent)}</p>
          </div>
          <div className={message.writer.username !== currentUser ? styles.messageContentInbound : styles.messageContentOutbound}>
            <p>{message.messageContent}</p>
            <img id={styles.userSentImage} src={message.image.url}></img>
          </div>
        </div>
        ))}
        <div className={styles.sendMessageContainer}>
        <form>
            <label>Send Message:</label>
            <input 
                type="text"
                required
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
            />
            <button onClick={handleSubmit}>Send</button>
        </form>
        </div>
        </div>
      </div>
    </>
  );
}

export default Home;
