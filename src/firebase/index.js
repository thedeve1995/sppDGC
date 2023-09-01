// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDtHuT6kprvEXHvlCuYyJ5GAvOKYRVsFdo",
  authDomain: "mytodolist-95.firebaseapp.com",
  projectId: "mytodolist-95",
  storageBucket: "mytodolist-95.appspot.com",
  messagingSenderId: "497562446045",
  appId: "1:497562446045:web:5ef18e42c191f79b5a9334",
  measurementId: "G-58SHLV45BR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {
    db
}