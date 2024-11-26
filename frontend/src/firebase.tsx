// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "lta-file-storage.firebaseapp.com",
  projectId: "lta-file-storage",
  storageBucket: "lta-file-storage.appspot.com",
  messagingSenderId: "1068451331380",
  appId: "1:1068451331380:web:af758fabd9963818607961",
  measurementId: "G-75Z6G5R0NF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);