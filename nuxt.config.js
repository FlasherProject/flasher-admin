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
    middleware: ['auth']
  },
  auth: {
    rewriteRedirects: false,
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/',
      home: '/'
    },
    strategies: {
      'laravel.passport': {
        url: process.env.REMOTE_API,
        client_id: process.env.LARAVEL_PASSPORT_CLIENT_ID,
        client_secret: process.env.LARAVEL_PASSPORT_CLIENT_SECRET,
        redirect_uri: process.env.LARAVEL_PASSPORT_REDIRECT_URL
      },
      keycloakOld: {
        _scheme: 'oauth2',
        userinfo_endpoint: false,
        token_type: 'Bearer',
        token_key: 'access_token',
        grant_type: 'refresh_token',
        response_type: 'code',
        authorization_endpoint: 'http://keycloak.localhost/auth/realms/jkanda/protocol/openid-connect/auth',
        access_token_endpoint: 'http://keycloak.localhost/auth/realms/jkanda/protocol/openid-connect/token',
        client_id: 'flasher',
        client_secret: 'd2b6ec0a-f9ae-4b87-9432-7dbf4aed0e00'
      },
      keycloak: {
        _scheme: 'oauth2',
        endpoints: {
          authorization: 'http://keycloak.localhost/auth/realms/jkanda/protocol/openid-connect/auth',
          token: 'http://keycloak.localhost/auth/realms/jkanda/protocol/openid-connect/token',
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'code',
        grantType: 'authorization_code',
        //accessType: undefined,
        //redirectUri: undefined,
        clientId: 'flasher',
        clientSecret: 'd2b6ec0a-f9ae-4b87-9432-7dbf4aed0e00',
        // scope: ['openid', 'profile', 'email'],
      },
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
