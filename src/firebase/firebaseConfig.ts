import { initializeApp }
from "firebase/app";

import { getFirestore }
from "firebase/firestore";

import { getAuth }
from "firebase/auth";

const firebaseConfig = {

  apiKey:
    "AIzaSyAJPKsMziZKC1Zmp9COm8BpIatBL_dTmo8",

  authDomain:
    "arihant-5056c.firebaseapp.com",

  projectId:
    "arihant-5056c",

  storageBucket:
    "arihant-5056c.firebasestorage.app",

  messagingSenderId:
    "926856270724",

  appId:
    "1:926856270724:web:f6002bd79523f4186743d1",

  measurementId:
    "G-66HLHVL1XS"
};

const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);

export const auth =
  getAuth(app);