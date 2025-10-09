const f = document.getElementById('searchForm');
if (f) {
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (document.getElementById('q').value || '').trim();
    if (!q) return;
    // Llévalo a la página de pago con el target en el querystring
    location.href = `pago.html?q=${encodeURIComponent(q)}`;
  });
}
