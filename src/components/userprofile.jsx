import { useState, useEffect } from 'react';
import styles from '../styles/userprofile.module.css';

const UserProfile = ({JWT, setJWT, setCurrentUser}) => {
  const [userState, setUserState] = useState();
  const [editing, setEditing] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [usernameContent, setUsernameContent] = useState('');
  const [bioContent, setBioContent] = useState('');
  const [newName, setNewName] = useState('');

  console.log(JWT, 'jwt');

  const headers = {
    'Authorization': `Bearer ${JWT}`,
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'GET',
    headers: headers,
    mode: 'cors'
  };

  const fetchUser = () => {
    fetch('http://localhost:3000/currentuser', options)
      .then(response => response.json())
      .then(data => setUserState(data))
      .catch(error => console.error('Error fetching user:', error));
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    if (usernameContent) {
      try {
        const response = await fetch(`http://localhost:3000/updatecurrentuser`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${JWT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: usernameContent })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`${errorData}`);
        }
        setCurrentUser(usernameContent);
        setUsernameContent('');
        setEditingUsername(false);
        if (usernameContent) { setNewName(usernameContent); }
        fetchUser();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmitBio = async (e) => {
    e.preventDefault();
    if (bioContent) {
      try {
        const response = await fetch(`http://localhost:3000/updatecurrentuser`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${JWT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bio: bioContent })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`${errorData}`);
        }
        setBioContent('');
        setEditingBio(false);
        fetchUser();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {userState &&
        <div>
          <img src={userState.profilePic.url}></img>
          {editing === true ? <p>editing</p> : ''}
          <h1>{newName ? newName : userState.username}</h1>
          {editing === true && <button onClick={() => editingUsername === false ? setEditingUsername(true) : setEditingUsername(false)}>Edit My Username</button>}
          {editingUsername === true &&
            <form>
              <label>Set New Username: </label>
              <input
                type="text"
                required
                value={usernameContent}
                onChange={(e) => setUsernameContent(e.target.value)}
              />
              <button onClick={handleSubmitUsername}>Submit New Username</button>
            </form>
          }
          <p>{userState.bio}</p>
          {editing === true && <button onClick={() => editingBio === false ? setEditingBio(true) : setEditingBio(false)}>Edit My Bio</button>}
          {editingBio === true &&
            <form>
              <label>Set New Bio: </label>
              <input
                type="text"
                required
                placeholder={userState.bio}
                value={bioContent}
                onChange={(e) => setBioContent(e.target.value)}
              />
              <button onClick={handleSubmitBio}>Submit New Bio</button>
            </form>
          }
          <button onClick={() => editing === false ? setEditing(true) : setEditing(false)}>Edit My Profile</button>
        </div>
      }
    </>
  );
}

export default UserProfile;