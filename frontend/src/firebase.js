// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCfLorb4PjnD7zTOoQ_8SFcJZ3WJX5Kjeg",
  authDomain: "mcsr-leaderboard.firebaseapp.com",
  databaseURL: "https://mcsr-leaderboard-default-rtdb.firebaseio.com",
  projectId: "mcsr-leaderboard",
  storageBucket: "mcsr-leaderboard.firebasestorage.app",
  messagingSenderId: "353230641405",
  appId: "1:353230641405:web:5c289a281368eea4284694"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);