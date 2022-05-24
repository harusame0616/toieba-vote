import admin, { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

if (!process.env.FIREBASE_ADMIN_KEY) {
  throw new Error('Require Env: FIREBASE_ADMIN_KEY');
}
const key = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

// Initialize Firebase
if (!admin.apps.length) {
  initializeApp({ credential: credential.cert(key) }, 'toieba');
}
