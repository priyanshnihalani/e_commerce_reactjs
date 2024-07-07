// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCROgN7W4Syi11L0-ahn1zFdIm8LT0jcDA",
  authDomain: "formauth-b6335.firebaseapp.com",
  databaseURL: "https://formauth-b6335-default-rtdb.firebaseio.com",
  projectId: "formauth-b6335",
  storageBucket: "formauth-b6335.appspot.com",
  messagingSenderId: "903122420104",
  appId: "1:903122420104:web:d983862ae7dca60adeba3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); 
