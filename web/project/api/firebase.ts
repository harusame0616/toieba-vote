import { FirestoreAdminClient } from '@google-cloud/firestore/types/v1/firestore_admin_client';
import { credential } from 'firebase-admin';
import { initializeApp, Credential } from 'firebase-admin/app';
import admin from 'firebase-admin';

const key = require('../credentials/firebase-admin.json');

// Initialize Firebase
export const firebaseApp = initializeApp({ credential: credential.cert(key) });
// export const analytics = getAnalytics(firebaseApp);
