import admin, { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

const key = require('../credentials/firebase-admin.json');

// Initialize Firebase
if (!admin.apps.length) {
  initializeApp({ credential: credential.cert(key) }, 'toieba');
}
