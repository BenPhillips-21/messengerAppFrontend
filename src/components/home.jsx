import { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';
import { formatDistanceToNow } from 'date-fns';

const Home = ({
  JWT, setChats, 
  chatID, 
  currentUser, setCurrentUser, 
  allUsers, setAllUsers,
  currentChat, setCurrentChat,
  newMessageContent, setNewMessageContent,
  selectedImage, setSelectedImage,
  selectedChatImage, setSelectedChatImage,
  editingWindow, setEditingWindow,
  chatName, setChatName,
  addUsers, setAddUsers,
  usersToAdd, setUsersToAdd
}) => {

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

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
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
    fetchChat()
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
  fetchChat()
}

let currentChatUsers = []
if (currentChat !== undefined) {
  for (let i = 0; i < currentChat.users.length; i++) {
    currentChatUsers.push((currentChat.users[i].username))
  }
}


  return (
    <>
      <div className={styles.fatherContainer}>
      <div className={styles.messagesContainer}>
        <div className={styles.chatHeader}>
          <p>{currentChat !== undefined && currentChat.chatName}</p>
          {currentChat !== undefined && <img id={styles.gcImage} src={currentChat.image.url} />}
        </div>
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
        <div className={styles.chatInfoAndSettings}>
        {currentChat !== undefined ? <button onClick={() => editingWindow === false ? setEditingWindow(true) : setEditingWindow(false)}>Chat Settings</button> : ''}
        {editingWindow === true ? 
        <div className={styles.editingWindow}>
          {currentChat.users.length > 2 && (
            <>
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
                    <img style={{ width: '15%' }} src={URL.createObjectURL(selectedChatImage)} alt="Selected" />
                  </div>
                )}
                <button onClick={handleChangeChatImage}>Send</button>
              </form>
            </>
          )}
        <button onClick={() => handleAddUsersClick()}>Add Users</button>
        {addUsers === true ? <div className={styles.addUsersList}>
          {allUsers && allUsers.map((user) => (
              !currentChatUsers.includes(user.username) ? (
                <li id={styles.usersToAddListItems} key={user._id}>
                  <label>
                    {user.username}
                    <input
                      type="checkbox"
                      onChange={() => handleCheckToggle(user._id)}
                    />
                  </label>
                </li>
              ) : null
            ))}
          <button onClick={() => addSelectedUsers()}>Add Selected Users</button>
        </div> : ''}
        </div>
      : '' }
          <h3>Users in Chat:</h3>
          {currentChat !== undefined && currentChat.users.map((user, index) => (
          !currentChatUsers.includes(user._id) ? 
          <div className={styles.userInfo} key={index}>
            <img src={user.profilePic.url} />
            <p>{user.username}</p>
          </div> : null
        ))}
        </div>
      </div>
    </>
  );
}

export default Home;
