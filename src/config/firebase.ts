import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpUb_OT5V7VFfrm_cjtBfp2y2G3GCzgCc",
  authDomain: "oshilog-6558e.firebaseapp.com",
  projectId: "oshilog-6558e",
  storageBucket: "oshilog-6558e.firebasestorage.app",
  messagingSenderId: "805365464305",
  appId: "1:805365464305:web:436f4eae958992c71b7d50",
  measurementId: "G-Q43ZRDE7N4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
