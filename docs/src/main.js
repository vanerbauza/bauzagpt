import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';

// TODO: Sustituye por TUS valores reales (sin comillas extra/errores)
const cfg = {
  apiKey:     "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId:  "TU_PROJECT_ID",
  appId:      "TU_APP_ID"   // Formato: "1:XXXXXXXXXXXX:web:YYYYYYYYYYYYYYYY"
};

const app  = initializeApp(cfg);
const auth = getAuth(app);

// --- LOGIN GOOGLE ---
const provider = new GoogleAuthProvider();
window.bauzaLoginGoogle = async () => {
  const { user } = await signInWithPopup(auth, provider);
  const token = await user.getIdToken();
  localStorage.setItem('bauza_token', token);
  localStorage.setItem('bauza_user', JSON.stringify({ uid:user.uid, email:user.email, name:user.displayName, photo:user.photoURL }));
  window.location.href = './cuenta_ok.html?paid=1';
};

// --- BUSCADOR MULTI-MOTOR ---
function openIf(ok, url){ if(ok) window.open(url, '_blank', 'noopener'); }
window.bauzaSearch = () => {
  const qEl = document.getElementById('q'); const q = qEl.value?.trim();
  if(!q){ alert('Escribe una consulta'); qEl?.focus(); return; }
  const enc = encodeURIComponent(q);
  openIf(document.getElementById('eng_google').checked, https://www.google.com/search?q=);
  openIf(document.getElementById('eng_bing').checked,   https://www.bing.com/search?q=);
  openIf(document.getElementById('eng_ddg').checked,    https://duckduckgo.com/?q=);
};
