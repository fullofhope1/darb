// Firebase Cloud Messaging setup
// To enable push notifications:
// 1. Create project at https://console.firebase.google.com
// 2. Add web app, copy config below
// 3. Get FCM server key from Project Settings > Cloud Messaging
// 4. Add to server/.env as FCM_SERVER_KEY

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let messaging = null;

export async function initFirebase() {
  if (!firebaseConfig.apiKey || !firebaseConfig.messagingSenderId) {
    console.log('Firebase not configured. Push notifications disabled.');
    return;
  }

  try {
    const { initializeApp } = await import('firebase/app');
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    if (token) {
      const { default: api } = await import('./api');
      await api.post('/devices', { fcm_token: token, device_type: 'web' });
    }

    onMessage(messaging, (payload) => {
      console.log('Push notification received:', payload);
      if (payload.notification?.title) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/icons/icon-192.png',
        });
      }
    });
  } catch (err) {
    console.log('Firebase init error:', err.message);
  }
}
