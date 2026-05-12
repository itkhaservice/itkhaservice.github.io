import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDmbN8f0hWwpeZX2HreX0rOdmi8_zBHM8",
  authDomain: "itkha-339d2.firebaseapp.com",
  databaseURL: "https://itkha-339d2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itkha-339d2",
  storageBucket: "itkha-339d2.appspot.com",
  messagingSenderId: "1012233245440",
  appId: "1:1012233245440:web:0e5d00389fb64f30b6d9e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
