// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWOoAxPDDKXmZTTKw-3LYex6QiBgLIMv8",
  authDomain: "mango-47451.firebaseapp.com",
  projectId: "mango-47451",
  storageBucket: "mango-47451.firebasestorage.app",
  messagingSenderId: "631415312610",
  appId: "1:631415312610:web:d585d05b33c4bc18938ebb",
  measurementId: "G-V9TK04VVM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };