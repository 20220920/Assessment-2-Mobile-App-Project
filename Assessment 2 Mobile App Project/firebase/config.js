// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {collection,  initializeFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv7CRdwYfPL-yvQWerImvaKYEKUNpaIvY",
  authDomain: "react-native-final-964a6.firebaseapp.com",
  projectId: "react-native-final-964a6",
  storageBucket: "react-native-final-964a6.appspot.com",
  messagingSenderId: "502807643222",
  appId: "1:502807643222:web:4feb631603d7fe623d27f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)      
});
export const db = initializeFirestore(app, { experimentalForceLongPolling: true});

export const userRef = collection(db, 'Users');