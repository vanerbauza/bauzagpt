// docs/.vitepress/config.js
export default {
  lang: 'es-MX',
  title: 'BauzaGPT',
  description: 'NO BUSQUES LO QUE NO QUIERES ENCONTRAR',
  base: '/',                    // <- importante para dominio raíz en Cloudflare Pages
  themeConfig: {
    logo: '/banner.jpg',        // opcional: si tienes banner en /docs/public o en la raíz del repo
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Precios', link: '/precios' },
      { text: 'Contacto', link: '/contacto' }
    ],
    outline: [2, 3],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vanerbauza/bauzagpt.com' }
    ],
    footer: {
      message: 'BauzaGPT — OSINT legal',
      copyright: '© ' + new Date().getFullYear() + ' BauzaGPT'
    }
  },
  sitemap: { hostname: 'https://bauzagpt.com' } // opcional si usas plugin
}
