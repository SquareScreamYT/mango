import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWOoAxPDDKXmZTTKw-3LYex6QiBgLIMv8",
  authDomain: "mango-47451.firebaseapp.com",
  projectId: "mango-47451",
  storageBucket: "mango-47451.firebasestorage.app",
  messagingSenderId: "631415312610",
  appId: "1:631415312610:web:d585d05b33c4bc18938ebb",
  measurementId: "G-V9TK04VVM4",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
