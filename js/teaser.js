// ================= CONFIG RÁPIDA (DEMO) =================
const UNLOCK_CODE = "BAUZA_DEMO_20"; // Prueba: agrega ?unlock=BAUZA_DEMO_20 a la URL
const urlParams = new URLSearchParams(window.location.search);
const unlocked = urlParams.get("unlock") === UNLOCK_CODE;
// ========================================================

// Datos DEMO (no expongas URLs reales en modo gratis en producción)
const report = {
  consulta: (document.getElementById('q')?.value?.trim()) || (urlParams.get('q') || 'IVAN BAUZA'),
  folio: "BG-2025-10-10-072",
  counts: { redes: 2, foros: 3, sitios: 2, filtraciones: "0–1", imagenes: 5 },
  domains: ["facebook.com","instagram.com","github.com","reddit.com","bauzagpt.com"],
  rows: [
    { fuente: "Sitio web",   dato:"bauzagpt.com",             evidencia:"/evidencias/captura_001.png", conf:"Alto",  url:"https://bauzagpt.com" },
    { fuente: "Repos",       dato:"github.com/vanerbauza/…",  evidencia:"/evidencias/captura_002.png", conf:"Alto",  url:"https://github.com/vanerbauza" },
    { fuente: "Red social A",dato:"Perfil ‘Bauza’",           evidencia:"/evidencias/captura_003.png", conf:"Medio", url:"https://social-a.example/perfil" },
    { fuente: "Red social B",dato:"‘Bauza GPT’ (marca)",      evidencia:"/evidencias/captura_004.png", conf:"Medio", url:"https://social-b.example/marca" },
    { fuente: "Foro técnico",dato:"Hilo ciberseguridad (2019)",evidencia:"/evidencias/captura_006.png",conf:"Medio", url:"https://foro.example/hilo-2019" }
  ],
  emails: ["iv****@g****.com","bauza****@o*****k.com"]
};

// Helpers de máscara
function maskHost(host){
  const [core,...rest] = host.split('.');
  if (!core) return host;
  if (core.length <= 4) return core[0] + "***." + rest.join('.');
  return core.slice(0,2) + "****" + core.slice(-1) + "." + rest.join('.');
}
function maskUrl(u){
  try { const url = new URL(u); return maskHost(url.host) + "/…"; }
  catch { return u.replace(/^https?:\/\//,'').replace(/(.{2}).+(\..{2,})$/,"$1****$2"); }
}
function maskText(t){
  return t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,"****@****")
          .replace(/@[A-Za-z0-9_.-]+/g,"@****")
          .replace(/\b\d{6,}\b/g,"****");
}

// Render teaser (si existe la sección)
(function renderTeaser(){
  const countsUL = document.getElementById('t-counts');
  const domUL    = document.getElementById('t-domains');
  const tbody    = document.getElementById('t-rows');
  const emailsUL = document.getElementById('t-emails');
  if(!countsUL || !domUL || !tbody || !emailsUL) return;

  countsUL.innerHTML = `
    <li>Redes: <strong>${report.counts.redes}</strong></li>
    <li>Foros/market: <strong>${report.counts.foros}</strong></li>
    <li>Sitios/Repos: <strong>${report.counts.sitios}</strong></li>
    <li>Filtraciones: <strong>${report.counts.filtraciones}</strong></li>
    <li>Imágenes públicas: <strong>${report.counts.imagenes}</strong></li>
  `;

  domUL.innerHTML = report.domains.map(d => `<li>${unlocked ? d : maskHost(d)}</li>`).join('');

  tbody.innerHTML = report.rows.map(r => {
    const dato    = unlocked ? r.dato : maskUrl(r.url);
    const evLabel = unlocked ? r.evidencia.split('/').pop() : 'captura (BORROSA)';
    const evClass = unlocked ? 'mini' : 'mini blurred';
    const link    = unlocked ? `<a href="${r.url}" target="_blank" rel="noopener">Abrir</a>` : `<span class="lock">🔒</span>`;
    return `
      <tr>
        <td>${r.fuente}</td>
        <td>${maskText(dato)}</td>
        <td><span class="${evClass}">${evLabel}</span></td>
        <td>${r.conf}</td>
        <td>${link}</td>
      </tr>
    `;
  }).join('');

  emailsUL.innerHTML = report.emails.map(e =>
    unlocked ? `<li>${e}</li>` : `<li>${e.replace(/(.{2}).+(@).+/, "$1****$2****")}</li>`
  ).join('');
})();
