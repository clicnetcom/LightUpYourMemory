import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)