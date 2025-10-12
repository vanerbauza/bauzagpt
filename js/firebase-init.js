// /docs/js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// ⬇️ Pega aquí tu config real (de tu README de Firebase)
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  appId: "TU_APP_ID"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
