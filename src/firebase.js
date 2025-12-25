import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgQQz7f-dlNQKhdfUHNcKhdwUSEsAgGqQ",
  authDomain: "corc-clothes.firebaseapp.com",
  projectId: "corc-clothes",
  storageBucket: "corc-clothes.firebasestorage.app",
  messagingSenderId: "500060641348",
  appId: "1:500060641348:web:66682e6b50cfe84ef38411",
  measurementId: "G-SNDQGDYQ8Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);