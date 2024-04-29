import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/getuser.module.css';

const GetUser = ({JWT, userToGet, setUserToGet, chats, currentUser, setChatID, setMenu, setCurrentChat, activeItem, setActiveItem}) => {
    const [user, setUser] = useState(null)
    const [sharedChats, setSharedChats] = useState()

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

    useEffect(() => {
        fetch(`https://messengerappbackend-production.up.railway.app/getuser/${userToGet}`, options)
        .then(response => response.json())
        .then(data => setUser(data)) 
        .catch(error => console.error('Error fetching posts:', error));
      }, [userToGet])

      useEffect(() => {
        const leChats = [];
        if (user !== null) {
          for (let i = 0; i < chats.length; i++) {
            const subArray = chats[i].users;
            for (let j = 0; j < subArray.length; j++) {
              if (subArray[j].username === currentUser || subArray[j].username === user.username) {
                leChats.push(chats[i]);
              }
            }
          }
          const occurrences = {};
          leChats.forEach(item => {
            occurrences[item.chatName] = (occurrences[item.chatName] || 0) + 1;
          });
          const twiceOccurringChats = [];
          Object.entries(occurrences).forEach(([chatName, count]) => {
            if (count === 2) {
              const chat = leChats.find(item => item.chatName === chatName);
              twiceOccurringChats.push(chat);
            }
          });
          setSharedChats(twiceOccurringChats);
        }
      }, [user]);

      const visitChat = (chatid) => {
        setChatID(chatid)
        navigate("/home")
      }

      const startChat = async () => {
        let result = await checkIfPrivateChatExists(); 
        if (result === false) {
            await fetch(`https://messengerappbackend-production.up.railway.app/createchat/${user._id}`, createChatOptions)
                .then(response => response.json())
                .then(data => {
                    setChatID(data.chat._id);
                    setActiveItem(data.chat._id)
                    setMenu("yourChats");
                    setCurrentChat(data.chat);
                    console.log(data)
                    navigate("/home");
                })
                .catch(error => console.error('Error creating chat', error));
        }
    }

      const checkIfPrivateChatExists = () => {
        for (let i = 0; i < chats.length; i++) {
            const subArray = chats[i].users;
            if (subArray.length < 3) {
                if (subArray[1] === undefined) {
                    console.log("Subarray 1 undefined")
                } else if (subArray[0].username === user.username || subArray[1].username === user.username) {
                    setChatID(chats[i]._id)
                    navigate("/home")
                    return true
                }
            } 
        }
        return false
      }



    return (
      <>
        <div className={styles.userContainer}>
            <div className={styles.userInfo}>
                {user && 
                <div>
                    <img src={user.profilePic.url}></img>
                    <h1>@{user.username}</h1>
                    <h2>{user.bio}</h2>
                    <button onClick={() => startChat()}>Chat With {user.username}</button>
                </div>
                }
                
                {sharedChats !== undefined && sharedChats.length > 0 && <h3>Shared Chats:</h3>}
                {sharedChats !== undefined && sharedChats.length > 0 && 
                sharedChats.map((leChat, index) => (
                    <div onClick={() => visitChat(leChat._id)} key={index}>
                    <ul>
                      <li>{leChat.chatName}</li>
                    </ul>
                    </div>
                ))
                }
            </div>
        </div>
      </>
    );
  }
  
  export default GetUser;

