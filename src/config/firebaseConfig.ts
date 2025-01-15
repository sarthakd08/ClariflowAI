// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOqyAOSLRi0aENyqtNffrf_VKSQTDVbvI", // process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "clariflow-ai.firebaseapp.com",
  projectId: "clariflow-ai",
  storageBucket: "clariflow-ai.firebasestorage.app",
  messagingSenderId: "419704426941",
  appId: "1:419704426941:web:8939292c2e40eb50e142d4",
  measurementId: "G-QM81XSVM9W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

// const analytics = getAnalytics(app);

// Initialize Analytics only in the browser
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}