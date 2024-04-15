import { Link } from 'react-router-dom';
import styles from '../styles/navbar.module.css';

const Navbar = ({JWT, setJWT}) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/home" className={styles.navLink}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/currentuser" className={styles.navLink}>Profile</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/sign-up" className={styles.navLink}>Sign Up</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/login" className={styles.navLink}>Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
