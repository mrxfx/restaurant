/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics safely
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Analytics initialization failed:", err);
  }
}

export { app, db, auth, analytics };
