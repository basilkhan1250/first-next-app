// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAvtROkAvH5pTIRcbSKfnuc9SunqdO2s-o",
    authDomain: "first-next-project-6b206.firebaseapp.com",
    projectId: "first-next-project-6b206",
    storageBucket: "first-next-project-6b206.firebasestorage.app",
    messagingSenderId: "428398797287",
    appId: "1:428398797287:web:1447961e2c539c4d96dd42",
    measurementId: "G-MPGBF1BNNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)
// console.log(db)
   
// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }
export { db }