import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDhRiezZxk5jtTyyaSoLO90UXnGbZXmio",
  authDomain: "window-3d160.firebaseapp.com",
  projectId: "window-3d160",
  storageBucket: "window-3d160.appspot.com",
  messagingSenderId: "509604151828",
  appId: "1:509604151828:web:0da9e7f10d70c2d7575d01"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable offline persistence
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.log('Persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.log('Persistence not available');
      }
    });
    
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, db }; 