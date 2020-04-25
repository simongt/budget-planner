import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyBkWPPjzQEgw3R1OsCfWL_m-Hi8HRFjZT4',
  authDomain: 'project-a5ba5.firebaseapp.com',
  databaseURL: 'https://project-a5ba5.firebaseio.com',
  projectId: 'project-a5ba5',
  storageBucket: 'project-a5ba5.appspot.com',
  messagingSenderId: '386034505060',
  appId: '1:386034505060:web:aaa7a6b974d718fdaad671',
  measurementId: 'G-QH32PNQ2K1'
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
// always trigger google pop up whenever we use this auth google provider to sign in
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// The Firebase SDK is initialized and available here!
//
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
//
// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

// try {
//   let app = firebase.app();
//   let features = ['auth', 'database', 'messaging', 'storage'].filter(
//     feature => typeof app[feature] === 'function'
//   );
//   document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
// } catch (e) {
//   console.error(e);
//   document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
// }
