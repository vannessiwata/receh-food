# How to Connect Firebase

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Firestore Database** in test mode (or production mode with rules).
4.  Register a web app in the project settings.
5.  Copy the configuration keys.
6.  Create a file named `.env.local` in the root of your project (`e:\Receh\receh-food\.env.local`).
7.  Paste the following content and replace with your actual keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCRQAkLjZnpdCAV0zcF9F_1I3EmPIm9B9E"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="receh-food.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="receh-food"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="receh-food.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=111997596600
NEXT_PUBLIC_FIREBASE_APP_ID="1:111997596600:web:7dc07363161fe1cf14554d"
```

8.  Restart the development server (`Ctrl+C` then `npm run dev`).
