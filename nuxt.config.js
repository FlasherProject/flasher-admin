require('dotenv').config()

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
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv'
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
    '@nuxtjs/auth',
    'nuxt-fontawesome'
  ],
  buefy: {
    materialDesignIcons: false,
    defaultIconPack: 'fas',
    defaultIconComponent: 'font-awesome-icon'
  },
  fontawesome: {
    component: 'font-awesome-icon',
    imports: [
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      },
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.REMOTE_API || 'http://localhost:8000',
    debug: false,
    credentials: false,
    retry: { retries: 1 },
    proxy: false,
    common: {
      Accept: 'application/json'
    }
  },
  proxy: {
    '/api': 'http://localhost:8000'
  },
  router: {
    base: '/admin',
    middleware: ['auth']
  },
  auth: {
    strategies: {
      'laravel.passport': {
        url: process.env.REMOTE_API,
        client_id: process.env.LARAVEL_PASSPORT_CLIENT_ID,
        client_secret: process.env.LARAVEL_PASSPORT_CLIENT_SECRET,
        redirect_uri: process.env.LARAVEL_PASSPORT_REDIRECT_URL
      },
      'laravel.passport_ok': {
        url: 'http://localhost:8000',
        client_id: '10',
        client_secret: 'hAg65WE8jCBOfEIt6ESG845lW3iNMEcTKlgs5hdh',
        redirect_uri: 'http://localhost:3000/login'
      },
      oauth: {
        _scheme: 'oauth2',
        authorization_endpoint: `${process.env.REMOTE_API}/oauth/authorize`,
        // access_token_endpoint: `${process.env.REMOTE_API}/oauth/token`,
        token_key: 'access_token',
        token_type: 'Bearer',
        response_type: 'code',
        grant_type: 'authorization_code',
        scope: '*',
        url: process.env.REMOTE_API,
        client_id: process.env.LARAVEL_PASSPORT_CLIENT_ID,
        client_secret: process.env.LARAVEL_PASSPORT_CLIENT_SECRET,
        redirect_uri: process.env.LARAVEL_PASSPORT_REDIRECT_URL,
        userinfo_endpoint: false
      }
    }
  },
  dotenv: {
    /* module options */
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
