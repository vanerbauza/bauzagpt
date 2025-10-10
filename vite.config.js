// docs/.vitepress/config.js
export default {
  lang: 'es-MX',
  title: 'BauzaGPT',
  description: 'NO BUSQUES LO QUE NO QUIERES ENCONTRAR',
  base: '/',                       // importante para dominio raíz
  themeConfig: {
    logo: '/banner.jpg',           // opcional (pon banner.jpg en docs/public/)
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
  }
}
