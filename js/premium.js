document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnPremium');
  if (!btn) return;

  const qEl = document.getElementById('q'); // tu input de búsqueda

  btn.addEventListener('click', () => {
    // Lee la query si el usuario escribió algo
    const q = (qEl?.value || '').trim();

    // Toma el href actual y agrega ?q=...
    const baseHref = btn.getAttribute('href') || '/docs/checkout.html?plan=pro';

    try {
      const url = new URL(baseHref, window.location.origin);
      if (q) url.searchParams.set('q', q);   // añade la consulta
      // (Opcional) plan fijo:
      if (!url.searchParams.get('plan')) url.searchParams.set('plan', 'pro');

      // Actualiza el href justo antes de navegar
      btn.setAttribute('href', url.pathname + url.search);
    } catch (e) {
      // si el href es relativo raro, no rompemos nada
    }
  });
});
