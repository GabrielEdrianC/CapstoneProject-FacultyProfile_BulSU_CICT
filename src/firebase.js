// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  /* MAIN DATABASE FIREBASE1 (cict-arl-v1) RESERVE FOR DEFENSE*/
  
  // apiKey: "AIzaSyCpeZh1nFR0kaMTKk-hR8xFJ77wItvCLXw",
  // authDomain: "cict-arl-v1.firebaseapp.com",
  // projectId: "cict-arl-v1",
  // storageBucket: "cict-arl-v1.appspot.com",
  // messagingSenderId: "58474889664",
  // appId: "1:58474889664:web:e5e61aa169951cade7c825"
  

  // /*FIREBASE2 (cict-wp2-2)*/
  
  // apiKey: "AIzaSyBgHPc0h1_Nage3DJwWlYG72CZ0AoHReUk",
  // authDomain: "cict-wp2-2.firebaseapp.com",
  // projectId: "cict-wp2-2",
  // storageBucket: "cict-wp2-2.appspot.com",
  // messagingSenderId: "556533652681",
  // appId: "1:556533652681:web:97324ea897b85c61660118"
  

  /*FIREBASE3 (cict-wp2-3)*/
   
  // apiKey: "AIzaSyD1wMRPjVi6a4R0JzJDADXJsP9vvB1x5OY",
  // authDomain: "cict-wp2-3.firebaseapp.com",
  // projectId: "cict-wp2-3",
  // storageBucket: "cict-wp2-3.appspot.com",
  // messagingSenderId: "543455014271",
  // appId: "1:543455014271:web:6ce45ea86562e762abbe4a"
  

  /*FIREBASE4 (cict-wp2-4)*/
   
  // apiKey: "AIzaSyBm6Lvl_aG6IqdnUN8xIriwWxN1hPPTKZ8",
  // authDomain: "cict-wp2-4.firebaseapp.com",
  // projectId: "cict-wp2-4",
  // storageBucket: "cict-wp2-4.appspot.com",
  // messagingSenderId: "651359352313",
  // appId: "1:651359352313:web:a22643df89cf1cfabcb928"
  
 
  // /*FIREBASE5 (cict-wp2-5)*/
  
  // apiKey: "AIzaSyC64MCC3l-GlHYoVHlIT-TsiQV7LOEvZEU",
  // authDomain: "cict-wp2-5.firebaseapp.com",
  // projectId: "cict-wp2-5",
  // storageBucket: "cict-wp2-5.appspot.com",
  // messagingSenderId: "1024166939194",
  // appId: "1:1024166939194:web:0845d57e2d1411cfc80303"

   /*FIREBASE5 (cict-wp2-6)*/

  // apiKey: "AIzaSyBj955M9crE0Mt9347RHQGRhijUPvpO5W4",
  // authDomain: "cict-wp2-6.firebaseapp.com",
  // projectId: "cict-wp2-6",
  // storageBucket: "cict-wp2-6.appspot.com",
  // messagingSenderId: "883543696678",
  // appId: "1:883543696678:web:01395636e4f9714a194de7",
  // measurementId: "G-HZ7W254TSR"

   /*FIREBASE5 (cict-wp2-7)*/

  apiKey: "AIzaSyAzNHBXdQggqUVEnCHiKbD4pmD6eQ42_0Y",
  authDomain: "cict-wp2-7.firebaseapp.com",
  projectId: "cict-wp2-7",
  storageBucket: "cict-wp2-7.appspot.com",
  messagingSenderId: "1026211176108",
  appId: "1:1026211176108:web:432ec231c93e42faee0909",
  measurementId: "G-GYYNGE06GM"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
 const authentication = getAuth(app);

// Initialize Firebase Storage
const imgDB = getStorage(app);

// Initialize Firestore
const txtDB = getFirestore(app);


export { authentication, txtDB,imgDB };
