// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu2UuwnBp3M9rBWAxIQtwbEjKmVfeWaeY",
  authDomain: "its122l-project.firebaseapp.com",
  projectId: "its122l-project",
  storageBucket: "its122l-project.firebasestorage.app",
  messagingSenderId: "155420991782",
  appId: "1:155420991782:web:55f66bd5ca0159995ea1e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default app;