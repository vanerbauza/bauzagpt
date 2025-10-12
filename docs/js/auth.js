import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3a7cv735RQPYsXMdn4KWQ-NDugL7WyfI",
  authDomain: "studio-6473341422-75630.firebaseapp.com",
  projectId: "studio-6473341422-75630",
  messagingSenderId: "240684953453",
  appId: "1:240684953453:web:17686d2dd526afcde8b464"
  // storageBucket: "studio-6473341422-75630.appspot.com", // si luego usas Storage
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    localStorage.setItem('bauza_token', token);
    localStorage.setItem('bauza_user', JSON.stringify({
      uid: user.uid, email: user.email, name: user.displayName, photo: user.photoURL
    }));
    location.href = './cuenta_ok.html?paid=1';
  }
});

window.bauzaLoginGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    const token = await user.getIdToken();
    localStorage.setItem('bauza_token', token);
    localStorage.setItem('bauza_user', JSON.stringify({
      uid: user.uid, email: user.email, name: user.displayName, photo: user.photoURL
    }));
    location.href = './cuenta_ok.html?paid=1';
  } catch (e) {
    console.error(e);
    alert('No se pudo iniciar sesión. Revisa: Google (Enable) y Authorized domains.');
  }
};

window.bauzaLogout = async () => {
  await signOut(auth);
  localStorage.removeItem('bauza_token');
  localStorage.removeItem('bauza_user');
  location.href = './index.html';
};
