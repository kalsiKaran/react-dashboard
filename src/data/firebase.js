import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage'
 
const firebaseConfig = {
    apiKey: "AIzaSyAvTFc7uVGPPdGeipFxoe0EuFFQA6mUzfY",
    authDomain: "react-dashboard-dd469.firebaseapp.com",
    projectId: "react-dashboard-dd469",
    storageBucket: "react-dashboard-dd469.appspot.com",
    messagingSenderId: "172130280838",
    appId: "1:172130280838:web:a60005e66cc1b16ae83807"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  export const db = getFirestore(firebaseApp);
    
  export const storage = getStorage(firebaseApp)
