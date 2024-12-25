import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcJhm0TDnB7Wa-v6kXCztEgc5SSnDXvRU",
  authDomain: "stops-tracker1.firebaseapp.com",
  projectId: "stops-tracker1",
  storageBucket: "stops-tracker1.firebasestorage.app",
  messagingSenderId: "623630116403",
  appId: "1:623630116403:web:6126d913d68ae5256d6546"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;