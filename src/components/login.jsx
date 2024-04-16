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
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newUser = { username, password } 
        
        setLoading(true)
        try {
        const response = await fetch('http://localhost:3000/login', {
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
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} className={styles.registerForm}>
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
                        {loading && <button disabled>Registering...</button>}
                        <button>Login as Demo User</button>
                    </form>
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
