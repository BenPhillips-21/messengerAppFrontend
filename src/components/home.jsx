import styles from '../styles/home.module.css';

const Home = ({JWT, setJWT}) => {
  return (
    <>
      <div className={styles.fatherContainer}>
        <div className={styles.chatContainer}>
          <ul>
            <li>Chat 1</li>
            <li>Chat 2</li>
            <li>Chat 3</li>
          </ul>
        </div>
        <div className={styles.messagesContainer}>
          <p>Messages</p>
          <p>More messages....</p>
        </div>
      </div>
    </>
  );
}

export default Home;
