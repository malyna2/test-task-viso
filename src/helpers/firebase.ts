// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9t2S8tYnTeMalMYFaDMkmBk5qwMIOvSM",
  authDomain: "viso-44549.firebaseapp.com",
  databaseURL: "https://viso-44549-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "viso-44549",
  storageBucket: "viso-44549.appspot.com",
  messagingSenderId: "807028201094",
  appId: "1:807028201094:web:5d94e9e629f007f5fa2307"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export {database}