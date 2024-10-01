// src/components/FirebaseAuth.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseconfig";

// Email/Password Sign-in
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Email/Password Register
export const register = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Google Sign-in
export const googleSignIn = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign-out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};
