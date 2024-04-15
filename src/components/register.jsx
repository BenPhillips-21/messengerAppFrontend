import styles from '../styles/register.module.css';

const Register = ({JWT, setJWT}) => {
    return (
      <>
          <div className={styles.registerContainer}>
              <div className={styles.registerBox}>
                <h1>Register here</h1>
              </div>
              <div className={styles.sitePreview}>
                <h1>Site Preview</h1>
              </div>
          </div>
      </>
    );
  }
  
  export default Register;
  