import admin, { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

const appConfig = (() => {
  if (process.env.NODE_ENV === 'production') {
    let key;
    try {
      key = JSON.parse(process.env.FIREBASE_ADMIN_KEY!);
    } catch {
      throw new Error('Invalid Setting: FIREBASE_ADMIN_KEY');
    }
    return {
      credential: credential.cert(key),
    };
  } else {
    return { projectId: 'demo-project' };
  }
})();

// Initialize Firebase
if (!admin.apps.length) {
  initializeApp(appConfig, 'toieba');
}
