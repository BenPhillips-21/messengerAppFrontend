import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/register.module.css';

import SitePreview from './sitepreview';

const Register = ({JWT, setJWT}) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmedPassword, setConfirmedPassword] = useState(null)
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState('');
    const [error, setError] = useState(false)
    const navigate = useNavigate();

    const demoLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/demologin', {
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
      e.preventDefault();
      const newUser = { username, password, confirmedPassword };
  
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:3000/sign-up', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });
  
        if (!response.ok) {
          setError(true)
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setResponse(data);
        setJWT(data.token)
        setLoading(false);
        navigate('/login');
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    return (
      <>
          <div className={styles.registerContainer}>
              <div className={styles.registerFormContainer}>
                <h1>Welcome to Conversa</h1>
                <div className={styles.registerForm}>
                    <h1>Register here</h1>
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
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            required
                            value={confirmedPassword}
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                        />
                        {error && 
                            <ul>
                                <li>Password and confirmed password must match.</li>
                                <li>Password must be at least 6 characters long.</li>
                            </ul>
                        }
                        {!loading && <button>Submit</button>}
                        {loading && <button disabled>Registering...</button>}
                    </form>
                    <button onClick={() => {demoLogin()}}>Login as Demo User</button>
                    <button id={styles.registeredButton} onClick={() => navigate('/login')}>Already Registered?</button>
                </div>
              </div>
              <div className={styles.sitePreview}>
                <SitePreview/>
              </div>
          </div>
      </>
    );
  }
  
  export default Register;
  