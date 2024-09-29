// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZdo9s-W0U2LGU9JfP8jdwOBa2sDbz2uA",
  authDomain: "shuttlemate-9bedd.firebaseapp.com",
  projectId: "shuttlemate-9bedd",
  storageBucket: "shuttlemate-9bedd.appspot.com",
  messagingSenderId: "902062135902",
  appId: "1:902062135902:web:8d8d923e3d85771262b2cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app)

export {app,auth};