import { globalContext } from '../contexts/globalContext';
import { useContext } from 'react';
import firebase from 'firebase/compat/app';


export default function Home(){
    const {user} = useContext(globalContext);
    if (user) {
      return (<div>Home Logined
         <div>
       <h1>My App</h1>
       <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
       <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
     </div>
      </div>)
        // // The user object has basic properties such as display name, email, etc.
        // const displayName = user.displayName;
        // const email = user.email;
        // const photoURL = user.photoURL;
        // const emailVerified = user.emailVerified;
        
        // console.log({
        //     displayName: user.displayName,
        //     email: user.email,
        //     photoURL: user.photoURL,
        //     emailVerified: user.emailVerified,
            
        //   });
        // // The user's ID, unique to the Firebase project. Do NOT use
        // // this value to authenticate with your backend server, if
        // // you have one. Use User.getToken() instead.
        // const uid = user.uid;
        // user.providerData.forEach((profile) => {
        //     console.log("Sign-in provider: " + profile.providerId);
        //     console.log("  Provider-specific UID: " + profile.uid);
        //     console.log("  Name: " + profile.displayName);
        //     console.log("  Email: " + profile.email);
        //     console.log("  Photo URL: " + profile.photoURL);
        //   });
      }


    return (<div>Home</div>)
}