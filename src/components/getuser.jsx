import { useState, useEffect } from 'react';
import styles from '../styles/getuser.module.css';

const GetUser = ({JWT, userToGet, setUserToGet, chats, currentUser}) => {
    const [user, setUser] = useState(null)
    const [sharedChats, setSharedChats] = useState()

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
        fetch(`http://localhost:3000/getuser/${userToGet}`, options)
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


    return (
      <>
        <div className={styles.userContainer}>
            <div className={styles.userInfo}>
                {user && 
                <div>
                    <img src={user.profilePic.url}></img>
                    <h1>{user.username}</h1>
                    <h2>{user.bio}</h2>
                </div>
                }
                {sharedChats !== undefined && 
                sharedChats.map((leChat, index) => (
                    <div key={index}>
                    {leChat.chatName}
                    </div>
                ))
                }
            </div>
        </div>
      </>
    );
  }
  
  export default GetUser;

