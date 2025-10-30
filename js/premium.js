// premium.js
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnPremium');
  const qEl = document.getElementById('q');
  if (!btn) return;

  // Usa data-href si quieres sobreescribir desde HTML; si no, toma el href del <a>
  const baseHref = btn.dataset.href || btn.getAttribute('href') || 'checkout.html';
  const defaultPlan = btn.dataset.plan || 'pro';

  const goCheckout = () => {
    const q = (qEl?.value || '').trim();

    // Base relativa al documento actual (ideal para GitHub Pages)
    const url = new URL(baseHref, window.location.href);

    if (q) url.searchParams.set('q', q);
    if (!url.searchParams.get('plan')) url.searchParams.set('plan', defaultPlan);

    // (Opcional) arrastra UTM/ref si vienen en la URL actual
    const current = new URL(window.location.href);
    ['utm_source','utm_medium','utm_campaign','ref'].forEach(k => {
      if (current.searchParams.has(k) && !url.searchParams.has(k)) {
        url.searchParams.set(k, current.searchParams.get(k));
      }
    });

    // Navega de forma explícita (robusto en todos los casos)
    window.location.assign(url.pathname + url.search);
  };

  // Click en el botón/enlace
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    goCheckout();
  });

  // Enter en el input
  if (qEl) {
    qEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        goCheckout();
      }
    });
  }
});
