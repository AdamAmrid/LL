import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBMp8Ku597y7qk3tcB3rVstWtbLjVeFsJU",
  authDomain: "um6p-solidarity-network.firebaseapp.com",
  projectId: "um6p-solidarity-network",
  storageBucket: "um6p-solidarity-network.firebasestorage.app",
  messagingSenderId: "461032775042",
  appId: "1:461032775042:web:e299674d3ff36eea1d839b",
  measurementId: "G-TVYJL4VYNG"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// Helper function to get the correct callback URL
export const getCallbackUrl = () => {
  // Return http://localhost:5173 for local development, or current window location origin
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5173'
  }
  return window.location.origin
}
