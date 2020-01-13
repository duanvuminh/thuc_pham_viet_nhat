import colors from 'vuetify/es5/util/colors'
require('dotenv').config();
import getAppRoutes from './server/modules/getRoutes';

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Cách học thuộc Kanji, nhớ kanji',
    title: process.env.site_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1'},
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'vuetify/dist/vuetify.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{ src: '~/plugins/fireinit.js' },{ src: '~/plugins/clientRender.js', mode: 'client' }],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/vuetify',
    'nuxt-material-design-icons'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    '@nuxtjs/sitemap',
    '@nuxtjs/pwa'
  ],
  markdownit: {
    injected: true,
    preset: 'default',
    linkify: true,
    breaks: true,
    use: [
      'markdown-it-div',
      'markdown-it-attrs',
      ['markdown-it-video', { youtube: { width: "100%", height: 390 } }]
    ]
  },
  sitemap:
  {
    hostname: 'https://oboemasu.com/',
    path: '/sitemap.xml',
    gzip: true,
    generate: false,
    routes: () => {
      return getAppRoutes.url()
    },
    exclude: ['/auth/', '/auth/**']
  },
  proxy: [
    // 'https://mazii.net/api/search',

  ],
  pwa: {
    manifest: {
      name: 'Oboe',
      lang: 'en',
      description: "cách nhớ kanji",
      prefer_related_applications: true
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /https:\/\/oboemasu.com\/api\/.*/,
          handler: 'networkFirst',
          options: {
            cacheName: 'oboe-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 300
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /https:\/\/oboemasu.com\/v1\/.*/,
          handler: 'networkFirst',
          options: {
            cacheName: '9gag-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 300
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://fonts.gstatic.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://cdn.jsdelivr.net/.*',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://firebasestorage.googleapis.com/.*',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        }
      ]
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'https://oboemasu.com/',
    // baseURL: 'http://localhost:3000/',
    // proxy: true,
    // proxyHeaders: false,
    // credentials: false
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake:false,
    theme: {
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
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
    extend(config, ctx) {
    },
    //transpile: ['vue-instantsearch', 'instantsearch.js/es'],
    extractCSS: true,
  },
  /*
  ** render
  */
  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => ['script', 'style', 'font'].includes(type),
      // resourceHints:false
    }
  },
  /*
  ** router
  */
  router: {
    middleware: "router-auth",
    extendRoutes(routes, resolve) {
    }
  },
  serverMiddleware: ["~/server"],
}
