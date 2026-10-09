import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'itinera-platform',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY.length > 5
);

let app;
if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} else {
  // Graceful initialization or placeholder
  try {
    app = getApps().length > 0 ? getApp() : initializeApp({
      apiKey: 'demo-api-key',
      authDomain: 'itinera-demo.firebaseapp.com',
      projectId: 'itinera-demo',
      storageBucket: 'itinera-demo.appspot.com',
      appId: '1:123456789:web:abcdef',
    });
  } catch (err) {
    console.warn('Firebase initialized in local mock fallback mode.');
  }
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
