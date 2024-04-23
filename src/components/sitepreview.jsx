import styles from '../styles/sitePreview.module.css';

const SitePreview = () => {
    return (
      <>
          <div className={styles.sitePreviewContainer}>
            <div className={styles.videoContainer}>
              <video loop muted autoPlay controls>
                <source src="https://res.cloudinary.com/dlsdasrfa/video/upload/v1713845341/messengerDemoVid_c8gwah.mp4" type="video/mp4"/>
              </video>
            </div>
          </div>
      </>
    );
  }
  
  export default SitePreview;
