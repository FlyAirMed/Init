import { initializeApp, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK if not already initialized
export const initFirebaseAdmin = () => {
  let app
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  } catch (e) {
    app = getApp()
  }

  const db = getFirestore()
  
  return { app, db }
}

// Get Firestore database instance
export const getDb = () => {
  const { db } = initFirebaseAdmin()
  return db
} 