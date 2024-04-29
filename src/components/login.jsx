import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../styles/register.module.css';

import SitePreview from './sitepreview';

const Login = ({ setJWT }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState('');
    const [error, setError] = useState(false)
    const navigate = useNavigate();

    const demoLogin = async () => {
        try {
            const response = await fetch('https://messengerappbackend-production.up.railway.app/demologin', {
              method: 'POST',
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
            setResponse(data);
            setJWT(data.token)
            setLoading(false);
            navigate('/home');
          } catch (error) {
            console.error('Error:', error);
            setLoading(false);
          }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newUser = { username, password } 
        
        setLoading(true)
        try {
        const response = await fetch('https://messengerappbackend-production.up.railway.app/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        
        if (!response.ok) {
            setError(true)
            throw new Error("Username or password incorrect")
        }

        const data = await response.json()
        setResponse(data)
        setJWT(data.token)
        setLoading(false)
        navigate(`/home`)
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    }

    return (
      <>
          <div className={styles.registerContainer}>
              <div className={styles.registerFormContainer}>
                <div className={styles.registerForm}>
                    <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <h1>Login</h1>
                        <label>Username:</label>
                        <input 
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>Password:</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p>Username or password incorrect.</p>}
                        {!loading && <button>Submit</button>}
                        {loading && <button disabled>Logging in...</button>}
                    </form>
                    <div className={styles.otherButtonsContainer}>
                      <button onClick={() => {demoLogin()}}>Login as Demo User</button>
                      <button onClick={() => navigate('/sign-up')}>Register</button>
                    </div>
                </div>
              </div>
              <div className={styles.sitePreview}>
                <SitePreview/>
              </div>
          </div>
      </>
    );
}

export default Login
