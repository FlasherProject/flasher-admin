export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc : https://typescript.nuxtjs.org/guide/setup.html
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth'
  ],
  buefy: {
    defaultIconComponent: 'vue-fontawesome',
    defaultIconPack: 'fas'
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:8000',
    debug: false,
    credentials: true,
    retry: { retries: 1 },
    proxy: true,
    common: {
      Accept: 'application/json'
    }
  },
  proxy: {
    '/api': 'http://localhost:8000'
  },
  router: {
    middleware: ['auth']
  },
  auth: {
    strategies: {
      'laravel.passport': {
        url: '/',
        client_id: '4',
        client_secret: 'clfa1UzjROYCdJmtBhglPKZfhHF2gixj5VVb9Wwh'
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (_config, _ctx) {}
  },
  typescript: {
    typeCheck: {
      /*
       ** Runtime lint
       */
      eslint: false
    }
  }
}
