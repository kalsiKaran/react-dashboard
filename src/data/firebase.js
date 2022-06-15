import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB4Zoz01yQAmLDfmYFfGXU0TBawC2vdh8Y",
    authDomain: "react-dashboard-5f925.firebaseapp.com",
    projectId: "react-dashboard-5f925",
    storageBucket: "react-dashboard-5f925.appspot.com",
    messagingSenderId: "338238730367",
    appId: "1:338238730367:web:8f6e3490a47547b6590f4a"
  };

  firebase.initializeApp(firebaseConfig)

  export default firebase;