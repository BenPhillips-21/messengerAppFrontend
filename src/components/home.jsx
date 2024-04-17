import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/home.module.css';

const Home = ({JWT, setJWT}) => {
  const [chats, setChats] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [chatID, setChatID] = useState()
  const [currentChat, setCurrentChat] = useState()
  const [newMessageContent, setNewMessageContent] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedChatImage, setSelectedChatImage] = useState(null)
  const [editingWindow, setEditingWindow] = useState(false)
  const [chatName, setChatName] = useState()
  const [addUsers, setAddUsers] = useState(false)
  const [allUsers, setAllUsers] = useState(null)
  const [usersToAdd, setUsersToAdd] = useState([])

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let image = selectedImage
    let messageContent = newMessageContent
    const formData = new FormData();
    formData.append('image', image)
    formData.append('messageContent', messageContent)
    try {
        const response = await fetch(`http://localhost:3000/${chatID}/sendmessage`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${JWT}`
            },
            body: (formData)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData}`);
          }  
        
        setSelectedImage(null)
        setNewMessageContent('')
        fetchChat()
    } catch (err) {
        throw new Error(`${err}`);
    }
}

const handleChangeChatImage = async (e) => {
  e.preventDefault()
  let image = selectedChatImage
  const formData = new FormData();
  formData.append('image', image)
  try {
    const response = await fetch(`http://localhost:3000/${chatID}/changechatimage`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${JWT}`
        },
        body: (formData)
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData}`);
      }  
    
    setSelectedChatImage(null)
    setEditingWindow(false)
} catch (err) {
    throw new Error(`${err}`);
}
}

const handleImageChange = (event) => {
  const file = event.target.files[0]; 
  setSelectedImage(file); 
};

const handleChatImageChange = (event) => {
  const file = event.target.files[0]; 
  setSelectedChatImage(file); 
};

const getInboundUserPfp = (chatUsersArray) => {
  for (let i = 0; i < chatUsersArray.length; i++) {
    if (chatUsersArray[i].username !== currentUser) {
      return chatUsersArray[i].profilePic.url
    }
  }
}

const handleChangeChatName = async (e) => {
  e.preventDefault();
  let newChatName = chatName;
  try {
    const response = await fetch(`http://localhost:3000/${chatID}/changechatname`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newChatName })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData}`);
    } 
    setChatName(); 
    setEditingWindow(false);
  } catch (err) {
    console.log(err);
  }
}

const handleAddUsersClick = async () => {
  if (addUsers === false) {
    setAddUsers(true)
    fetch('http://localhost:3000/allusers', options)
    .then(response => response.json())
    .then(data => setAllUsers(data)) 
    .catch(error => console.error('Error fetching posts:', error));
  } else {
    setAddUsers(false)
    setAllUsers(null)
    setUsersToAdd([])
  }
}

const handleToggle = (id) => {
  usersToAdd.push(id)
  setUsersToAdd(usersToAdd)
};

const addSelectedUsers = () => {
  for (let i = 0; i < usersToAdd.length; i++) {
    console.log(usersToAdd[i])
    fetch(`http://localhost:3000/${chatID}/${usersToAdd[i]}/addtochat`, options)
    .then(response => response.json())
    .then(data => console.log(data)) 
    .catch(error => console.error('Error fetching posts:', error));
  }
  setUsersToAdd([])
  setAddUsers(false)
  setAllUsers(null)
}

  return (
    <>
      <div className={styles.fatherContainer}>
      <div className={styles.chatContainer}>
        {chats.map((chat, index) => (
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
        ))}
      </div>
      <div className={styles.messagesContainer}>
        <div className={styles.chatHeader}>
          <p>Bello</p>
          {currentChat !== undefined ? <button onClick={() => editingWindow === false ? setEditingWindow(true) : setEditingWindow(false)}>Chat Settings</button> : ''}
        </div>
        {editingWindow === true ? 
        <div className={styles.editingWindow}>
          <form>
            <label>Change Chat Name:</label>
            <input 
                type="text"
                required
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
            />
            <button onClick={handleChangeChatName}>Send</button>
        </form>
        <form>
          <label>Change Chat Image:</label>
            <input type="file" accept="image/*" onChange={handleChatImageChange} />
            {selectedChatImage && (
              <div>
                <p>Selected Image:</p>
                <img style={{'width': '15%'}} src={URL.createObjectURL(selectedChatImage)} alt="Selected" />
              </div>
            )}
            <button onClick={handleChangeChatImage}>Send</button>
        </form>
        <button onClick={() => handleAddUsersClick()}>Add Users</button>
        {addUsers === true ? <div className={styles.addUsersList}>
            {allUsers && allUsers.map((user) => (
              <li key={user._id}>
              <label>
              {user.username}
                <input
                  type="checkbox"
                  checked={user.checked}
                  onChange={() => handleToggle(user._id)}
                />
              </label>
            </li>
            ))}
            <button onClick={() => addSelectedUsers()}>Add Selected Users</button>
        </div> : ''}
        </div>
      : '' }
        {currentChat !== undefined && currentChat.messages.map((message, index) => (
        <div className={styles.userMessage} key={index}>
          <div className={message.writer.username !== currentUser ? styles.msgInfoInbound : styles.msgInfoOutbound}>
            <p>{message.writer.username}</p>
            <p>{formatDate(message.dateSent)}</p>
          </div>
          <div className={message.writer.username !== currentUser ? styles.messageContentInbound : styles.messageContentOutbound}>
            <div className={message.writer.username !== currentUser ? styles.messageAndImageContainerInbound : styles.messageAndImageContainerOutbound}>
              <div className={styles.messageBubble}>
                {message.messageContent ? <p>{message.messageContent}</p> : ''}
              </div>
              <div className={message.writer.username !== currentUser ? styles.imageBubbleInbound : styles.imageBubbleOutbound}>
                {message.image.url ? <img id={styles.userSentImage} src={message.image.url}></img> : ''}
              </div>
            </div>
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <div>
                <p>Selected Image:</p>
                <img style={{'width': '50%'}} src={URL.createObjectURL(selectedImage)} alt="Selected" />
              </div>
            )}
            <button onClick={handleSubmit}>Send</button>
        </form>
        </div>
        </div>
      </div>
    </>
  );
}

export default Home;
