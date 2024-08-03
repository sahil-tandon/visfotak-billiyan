// src/utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBFP_TZPFrY5ussM8z6fnpQ9-F75iwjL9w",
  authDomain: "visfotak-billiyan.firebaseapp.com",
  databaseURL: "https://visfotak-billiyan-default-rtdb.firebaseio.com",
  projectId: "visfotak-billiyan",
  storageBucket: "visfotak-billiyan.appspot.com",
  messagingSenderId: "497865706297",
  appId: "1:497865706297:web:7370d542758363419ff6e8",
  measurementId: "G-T74JC1MZ6H"
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);