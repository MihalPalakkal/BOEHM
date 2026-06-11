// Firebase Push Notifications — safe no-op when credentials are not configured.
// This prevents the server from crashing at startup when FIREBASE_* env vars are missing.

let messaging = null;

try {
  const apiKey = process.env.FIREBASE_API_KEY;

  if (apiKey) {
    const firebase = require('firebase/app');
    require('firebase/messaging');

    firebase.initializeApp({
      apiKey,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    });

    messaging = firebase.messaging();
    console.log('Firebase messaging initialised.');
  } else {
    console.log('Firebase credentials not configured — push notifications disabled.');
  }
} catch (err) {
  console.warn('Firebase init failed (non-fatal):', err.message);
}

module.exports = {
  messaging,
  sendNotification: async (userId, title, message) => {
    // When messaging is unavailable we just log — never crash.
    console.log(`[Notification] to user ${userId}: ${title} — ${message}`);
  },
};
