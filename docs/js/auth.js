import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

// TODO: pega aquí TU CONFIG de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Auto-redirect si ya hay sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Guarda datos mínimos y redirige
    user.getIdToken().then((token) => {
      localStorage.setItem('bauza_token', token);
      localStorage.setItem('bauza_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL
      }));
      // Por ahora te mando a la cuenta OK (luego será tu dashboard real)
      window.location.href = './cuenta_ok.html?paid=1';
    });
  }
});

window.bauzaLoginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();
    localStorage.setItem('bauza_token', token);
    localStorage.setItem('bauza_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photo: user.photoURL
    }));
    window.location.href = './cuenta_ok.html?paid=1';
  } catch (err) {
    console.error('Login error', err);
    alert('No se pudo iniciar sesión. Intenta de nuevo.');
  }
};

window.bauzaLogout = async () => {
  await signOut(auth);
  localStorage.removeItem('bauza_token');
  localStorage.removeItem('bauza_user');
  alert('Sesión cerrada.');
  window.location.href = './index.html';
};
