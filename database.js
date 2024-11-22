const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged, reauthenticateWithCredential } = require("firebase/auth");
require("dotenv").config();

const list = [
    process.env.email_1, process.env.email_2, process.env.email_3, process.env.email_4, process.env.email_5, process.env.email_6, process.env.email_7
]
const password = process.env.password;

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(firebaseApp);

async function signInWithRetry() {
    const index = Math.floor(Math.random() * list.length);
    const email = list[index];
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`User signed in: ${user.uid}`);
      return user;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error signing in: ${errorCode} - ${errorMessage}`);
      
      // Retry logic
      console.log("Retrying authentication...");
      return await signInWithRetry();
    }
  }

async function reauthenticate(user) {
  try {
    // Reauthenticate the user with their email and password
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    console.log('User reauthenticated successfully!');
  } catch (error) {
    console.error('Error reauthenticating user:', error);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(`User logged in: ${uid}`);
    user.getIdToken(true) // Force refresh the token
      .then((token) => {
        console.log('Token refreshed successfully!');
      })
      .catch((error) => {
        console.error('Token refresh failed:', error);
        reauthenticate(user); // Reauthenticate the user if token refresh fails
      });
  } else {
    console.log("No user is signed in.");
    signInWithRetry();
  }
});

signInWithRetry().catch(err => console.error("Final authentication failure:", err));

module.exports = {
  database
}