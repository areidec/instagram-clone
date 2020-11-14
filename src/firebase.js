import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDPGaimLBICVOttBp99Qjd9THRLFG_1rHc",
  authDomain: "react-fire-71d10.firebaseapp.com",
  databaseURL: "https://react-fire-71d10.firebaseio.com",
  projectId: "react-fire-71d10",
  storageBucket: "react-fire-71d10.appspot.com",
  messagingSenderId: "679211331178",
  appId: "1:679211331178:web:e0b7e4fce193aab1d02413",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
const timeStamp = firebase.firestore.Timestamp;

export { db, auth, storage, arrayUnion, timeStamp };
