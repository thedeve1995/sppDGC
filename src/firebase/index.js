// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDtHuT6kprvEXHvlCuYyJ5GAvOKYRVsFdo",
  authDomain: "mytodolist-95.firebaseapp.com",
  databaseURL: "https://mytodolist-95-default-rtdb.firebaseio.com",
  projectId: "mytodolist-95",
  storageBucket: "mytodolist-95.appspot.com",
  messagingSenderId: "497562446045",
  appId: "1:497562446045:web:5f24003bf8e153c65a9334",
  measurementId: "G-CGY9F212NP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  db,
  storage,
  app // Export the storage object
};