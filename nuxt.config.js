import colors from 'vuetify/es5/util/colors'
require('dotenv').config();
const getAppRoutes = require('./utils/getRoutes.js');

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Giới thiệu về cửa hàng, món ăn, địa điểm ở Nhật',
    title: process.env.site_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/fireinit.js'],
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
    [
      'nuxt-i18n',{
        parsePages: false,
        pages: {
          '/': {
            en: '/tiengviet',
            ja: '/日本',
            lo: '/ພາສາລາວ',
          }
        }
      }],
    '@nuxtjs/markdownit',
    'nuxt-i18n',
    '@nuxtjs/sitemap'
  ],
  i18n: {
    locales: ['ja','en'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          welcome: 'Welcome'
        },
        ja: {
          welcome: 'ようこそ'
        }
      }
    }
  },
  markdownit: {
    injected: true
  },
  sitemap:
  {
    path: '/sitemap.xml',
    gzip: true,
    generate: false,
    routes: () => {
      return getAppRoutes()
    },
    exclude: ['/auth/', '/auth/**']
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'https://cors-anywhere.herokuapp.com/https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko',
    proxyHeaders: false,
    credentials: false
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
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
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
  },
  /*
  ** router
  */
  // router: {
  //   // middleware: 'auth'
  //   extendRoutes(routes, resolve) {
  //     routes.push({
  //       path: '/items/:id',
  //       components: {
  //         default: resolve(__dirname, 'pages/items')
  //       }
  //     })
  //   }
  // },

}
