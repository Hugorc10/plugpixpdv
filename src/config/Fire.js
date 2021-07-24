import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STOARGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSANGIN_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMNTE_ID,
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;
export const firestore = fire.firestore();
export const storage = fire.storage();
export const functions = firebase.functions();
