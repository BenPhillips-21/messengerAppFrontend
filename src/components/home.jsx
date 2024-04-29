import { useState, useEffect, useRef } from 'react';
import styles from '../styles/home.module.css';
import { formatDistanceToNow } from 'date-fns';

const Home = ({
  JWT, chats, setChats, 
  chatID, 
  currentUser, setCurrentUser, 
  allUsers, setAllUsers,
  currentChat, setCurrentChat,
  newMessageContent, setNewMessageContent,
  selectedImage, setSelectedImage,
  selectedChatImage, setSelectedChatImage,
  editingWindow, setEditingWindow,
  chatName, setChatName,
  // addUsers, setAddUsers,
  addUserss, setAddUserss,
  usersToAdd, setUsersToAdd,
  chad, setChad,
  activeItem, setActiveItem
}) => {

  const [showChangeChatName, setShowChangeChatName] = useState(false);
  const [showChangeChatImage, setShowChangeChatImage] = useState(false);

  console.log(chad, 'chad status')

  const [userObject, setUserObject] = useState()

  const findCurrentUser = () => {
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].username === currentUser) {
      return allUsers[i]
    }
  }
}

useEffect(() => {
  let result = findCurrentUser()
  setUserObject(result)
}, [currentChat])

  const [currentChatUsers, setCurrentChatUsers] = useState([])

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
    fetch(`https://messengerappbackend-production.up.railway.app/${chatID}`, options)
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
        const response = await fetch(`https://messengerappbackend-production.up.railway.app/${chatID}/sendmessage`, {
            method: 'POST',
            mode: 'cors', 
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
    const response = await fetch(`https://messengerappbackend-production.up.railway.app/${chatID}/changechatimage`, {
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
    const response = await fetch(`https://messengerappbackend-production.up.railway.app/${chatID}/changechatname`, {
      method: 'POST',
      mode: 'cors', 
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

const handleaddUserssClick = async () => {
  if (addUserss === false) {
    setAddUserss(true)
  } else {
    setAddUserss(false)
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
  try {
    for (let i = 0; i < usersToAdd.length; i++) {
      console.log(usersToAdd[i]);
      const response = await fetch(`https://messengerappbackend-production.up.railway.app/${chatID}/${usersToAdd[i]}/addtochat`, options);
      const data = await response.json();
      setCurrentChat(data.updatedChat);
    }
    setUsersToAdd([]);
    setAddUserss(false);
    fetchChat();
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

useEffect(() => {
  if (currentChat !== undefined) {
      const users = currentChat.users.map(user => user.username);
      setCurrentChatUsers(users);
  }
  console.log(currentChat, "currentChat")
}, [currentChat]);


const kickUser = async (userid) => {
  try {
    const response = await fetch(`https://messengerappbackend-production.up.railway.app/${chatID}/${userid}/kickfromchat`, options);
    if (!response.ok) {
      throw new Error('Failed to kick user from chat');
    }
    const data = await response.json();
    setCurrentChat(data.updatedChat);
    fetchChat();
  } catch (error) {
    console.error('Error kicking user:', error.message);
  }
}

const leaveChat = async (userid) => {
  try {
    const response = await fetch(`https://messengerappbackend-production.up.railway.app/${chatID}/${userid}/kickfromchat`, options);
    if (!response.ok) {
      throw new Error('Failed to kick user from chat');
    }
    const data = await response.json();
    setActiveItem()
    setCurrentChat()
    addUserss(false)
    fetchChat();
  } catch (error) {
    console.error('Error leaving chat:', error.message);
  }
}

const deleteMsg = async (messageid) => {
  try {
    const response = await fetch(`https://messengerappbackend-production.up.railway.app/${messageid}/deletemessage`, options);
    if (!response.ok) {
      throw new Error('Failed to delete message');
    }
    const data = await response.json();
    setCurrentChat(data.updatedChat);
    fetchChat();
  } catch (error) {
    console.error('Error deleting message:', error.message);
  }
}

const toggleChangeChatName = () => {
  setShowChangeChatName(!showChangeChatName);
  setShowChangeChatImage(false); // Close the chat image form if it's open
};

// Function to toggle the visibility of the chat image form
const toggleChangeChatImage = () => {
  setShowChangeChatImage(!showChangeChatImage);
  setShowChangeChatName(false); // Close the chat name form if it's open
};



  return (
    <>
      <div className={styles.fatherContainer}>
      <div className={styles.messagesContainer}>
      {currentChat === undefined && chats.length > 0 && <h1>Select a Chat from the menu!</h1>}
      {currentChat === undefined && chats.length === 0 && <h1>Start a Chat from the menu!</h1>}
      {currentChat !== undefined && currentChat.messages.length === 0 && <h1>Well... say something already!</h1>}
        {currentChat !== undefined && currentChat.messages.map((message, index) => (
          <div className={styles.userMessage} key={index}>
            <div className={message.writer && message.writer.username !== currentUser ? styles.msgInfoInbound : styles.msgInfoOutbound}>
            {message.writer && <img id={message.writer && message.writer.username !== currentUser ? styles.profilePicInbound : styles.profilePicOutbound} src={message.writer.profilePic.url}></img>}
              {message.writer && <p>{message.writer.username}</p>}
              <p>{message.dateSent && formatDate(message.dateSent)}</p>
            </div>
            <div className={message.writer && message.writer.username !== currentUser ? styles.messageContentInbound : styles.messageContentOutbound}>
              <div className={message.writer && message.writer.username !== currentUser ? styles.messageAndImageContainerInbound : styles.messageAndImageContainerOutbound}>
                <div className={styles.messageBubble}>
                  {message.messageContent ? <p>{message.messageContent}</p> : ''}
                </div>
                <div className={message.image && message.image.url ? (message.writer && message.writer.username !== currentUser ? styles.imageBubbleInbound : styles.imageBubbleOutbound) : ''}>
                  {message.image && message.image.url ? <img id={styles.userSentImage} src={message.image.url}></img> : ''}
                </div>
              </div>
            </div>
            {chad === true && 
            <div className={message.writer && message.writer.username !== currentUser ? styles.messageContentInbound : styles.messageContentOutbound}>
              <button id={styles.deleteButton} onClick={() => deleteMsg(message._id)}><img src="/trash-can.svg" alt="Trash Can Icon" /></button>
            </div>}
            {chad === false && message.writer.username === currentUser &&
            <div className={message.writer && message.writer.username !== currentUser ? styles.messageContentInbound : styles.messageContentOutbound}>
              <button id={styles.deleteButton} onClick={() => deleteMsg(message._id)}>
                <img src="/trash-can.svg" alt="Trash Can Icon" />
              </button>
            </div>}
          </div>
        ))}
        {currentChat && <div className={styles.sendMessageContainer}>
          <form>
              <input 
                  type="text"
                  required
                  placeholder='Write message here...'
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  rows="1"
                  className={styles.messageInput}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {selectedImage && (
                <div>
                  <p>Selected Image:</p>
                  <img className={styles.selectedImage} src={URL.createObjectURL(selectedImage)} alt="Selected" />
                </div>
              )}
              <button id={styles.sendButton} onClick={handleSubmit}>
                <img id={styles.sendArrow} src="/arrow.svg" alt="Arrow Icon" />
              </button>
          </form>
        </div>}
        </div>
        <div className={styles.chatInfoAndSettings}>
        {currentChat !== undefined && <button id={styles.settingsButton} onClick={() => editingWindow === false ? setEditingWindow(true) : setEditingWindow(false)}>
          <img src="/cogwheel.svg" alt="Settings Icon" />
        </button>}
        {editingWindow === true ? 
        <div className={styles.editingWindow}>
        <button onClick={toggleChangeChatName}>Change Chat Name</button>
        {showChangeChatName && (
          <form>
            <input 
              type="text"
              required
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
            <button onClick={handleChangeChatName}>Submit Name</button>
          </form>
        )}
        <button onClick={toggleChangeChatImage}>Change Chat Image</button>
        {showChangeChatImage && (
          <form>
            <input type="file" accept="image/*" onChange={handleChatImageChange} />
            {selectedChatImage && (
              <div>
                <p>Selected Image:</p>
                <img style={{ width: '15%' }} src={URL.createObjectURL(selectedChatImage)} alt="Selected" />
              </div>
            )}
            <button onClick={handleChangeChatImage}>Submit Image</button>
          </form>
        )}
        <button onClick={() => leaveChat(userObject._id)}>Leave Chat</button>
        {chad === true && <button onClick={() => handleaddUserssClick()}>Add Users</button>}
        {addUserss === true ? <div className={styles.addUsersList}>
          {allUsers && allUsers.map((user) => (
              !currentChatUsers.includes(user.username) ? (
                <li id={styles.usersToAddListItems} key={user._id}>
                  <label>
                    {'@' + user.username}
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
          {currentChat && <h3>Other Users:</h3>}
          {currentChat !== undefined && currentChat.users.map((user, index) => (
          !currentChatUsers.includes(user._id) && user.username !== currentUser ? 
          <div className={styles.userInfo} key={index}>
            {user.profilePic !== undefined && <img src={user.profilePic.url} />}
            <p>@{user.username}</p>
            {chad === true && <button onClick={() => kickUser(user._id)}><img id={styles.kickButton} src="/x-symbol.svg" alt="X Icon" /></button>}
          </div> : null
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
