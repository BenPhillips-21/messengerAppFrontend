import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Navbar from './components/navbar';
import Home from './components/home';
import UserProfile from './components/userprofile';
import GetUser from './components/getuser'
import Register from './components/register';
import Login from './components/login';
import Redirect from './components/redirect';

function App() {
  const [JWT, setJWT] = useState(null);
  const [menu, setMenu] = useState("yourChats")
  const [chats, setChats] = useState([])
  const [chatID, setChatID] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [allUsers, setAllUsers] = useState(null)
  const [currentChat, setCurrentChat] = useState()
  const [newMessageContent, setNewMessageContent] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedChatImage, setSelectedChatImage] = useState(null)
  const [editingWindow, setEditingWindow] = useState(false)
  const [chatName, setChatName] = useState()
  const [addUsers, setAddUsers] = useState(false)
  const [usersToAdd, setUsersToAdd] = useState([])
  const [userToGet, setUserToGet] = useState(null)
  const [chad, setChad] = useState(false)
  const location = useLocation();
  const showNavbar = !['/sign-up', '/login'].includes(location.pathname);

  return (
        <>
          {showNavbar && <Navbar 
            JWT={JWT} setJWT={setJWT}
            menu={menu} setMenu={setMenu} 
            chats={chats} setChats={setChats} 
            chatID={chatID} setChatID={setChatID} 
            currentUser={currentUser} setCurrentUser={setCurrentUser} 
            allUsers={allUsers} setAllUsers={setAllUsers}
            currentChat={currentChat} setCurrentChat={setCurrentChat}
            selectedChatImage={selectedChatImage}
            chatName={chatName}
            addUsers={addUsers} setAddUsers={setAddUsers}
            userToGet={userToGet} setUserToGet={setUserToGet}
            chad={chad} setChad={setChad}
            addUsers={addUsers} setAddUsers={setAddUsers}
            usersToAdd={usersToAdd} setUsersToAdd={setUsersToAdd}
          />}
            <Routes>
              <Route path="/" element={<Redirect />} />
              <Route path="/sign-up" element={<Register JWT={JWT} setJWT={setJWT} />} />
              <Route path="/home" element={<Home 
              JWT={JWT}
              chad={chad}
              setChats={setChats} chats={chats}
              chatID={chatID}
              currentUser={currentUser} setCurrentUser={setCurrentUser} 
              allUsers={allUsers} setAllUsers={setAllUsers}
              currentChat={currentChat} setCurrentChat={setCurrentChat}
              newMessageContent={newMessageContent} setNewMessageContent={setNewMessageContent}
              selectedImage={selectedImage} setSelectedImage={setSelectedImage}
              selectedChatImage={selectedChatImage} setSelectedChatImage={setSelectedChatImage}
              editingWindow={editingWindow} setEditingWindow={setEditingWindow}
              chatName={chatName} setChatName={setChatName}
              addUsers={addUsers} setAddUsers={setAddUsers}
              usersToAdd={usersToAdd} setUsersToAdd={setUsersToAdd}/>} />
              <Route path="/getuser" element={<GetUser JWT={JWT} setCurrentChat={setCurrentChat} userToGet={userToGet} setUserToGet={setUserToGet} chats={chats} currentUser={currentUser} setChatID={setChatID} setMenu={setMenu}/>} />
              <Route path="/currentuser" element={<UserProfile JWT={JWT} setJWT={setJWT} setCurrentUser={setCurrentUser}/>} />
              <Route path="/login" element={<Login JWT={JWT} setJWT={setJWT} />} />
            </Routes>
        </>
      );
}

export default App;




