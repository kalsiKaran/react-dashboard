import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyB4Zoz01yQAmLDfmYFfGXU0TBawC2vdh8Y",
    authDomain: "react-dashboard-5f925.firebaseapp.com",
    projectId: "react-dashboard-5f925",
    storageBucket: "react-dashboard-5f925.appspot.com",
    messagingSenderId: "338238730367",
    appId: "1:338238730367:web:8f6e3490a47547b6590f4a"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
    
  export default db;

  // export default firebase;