import { initializeApp }from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyABZf8OzrjPfuhs3SabsFgipz04YynftAc",
    authDomain: "netlfix-clone-9ef31.firebaseapp.com",
    projectId: "netlfix-clone-9ef31",
    storageBucket: "netlfix-clone-9ef31.appspot.com",
    messagingSenderId: "932288570770",
    appId: "1:932288570770:web:0cf775fa43cea47a4d0d4b"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

export { auth }; //explicit export
export default db;

