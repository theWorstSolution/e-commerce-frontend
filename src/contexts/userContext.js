import { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';

export var userContext = createContext();

// Configure Firebase.
const config = {
    apiKey: "AIzaSyCZAE4fCekKtBqen0-opldxPmKgdbUhnxU",
    authDomain: "thanhproj-63169.firebaseapp.com",
    databaseURL: "https://thanhproj-63169-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thanhproj-63169",
    storageBucket: "thanhproj-63169.appspot.com",
    messagingSenderId: "1072415708662",
    appId: "1:1072415708662:web:20d8e679716dea28b823d7",
    measurementId: "G-KCQ60358DL"
};
firebase.initializeApp(config);


export function UserProvider({children}){
    const [user, setUser] = useState(); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
    // nếu lỗi thì cần bỏ unregister đi
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <userContext.Provider value={user}>
      {children}
    </userContext.Provider>
  )
}