import colors from 'vuetify/es5/util/colors'
require('dotenv').config();

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
  plugins: [],
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
      'nuxt-i18n', {
        baseUrl: 'https://typing.lithong.com',
        seo: false,
        parsePages: false,
        pages: {
          index: {
            vi: '/',
            ja: '/'
          }
        }
      }],
    '@nuxtjs/axios',
    '@nuxtjs/sitemap'
  ],
  i18n: {
    locales: [{
      code: 'ja',
      iso: 'ja-JP'
    },
    {
      code: 'vi',
      iso: 'vi-VN'
    }],
    defaultLocale: 'vi',
    vueI18n: {
      fallbackLocale: 'vi',
      messages: {
        vi: {
          welcome: 'Hỗ trợ gõ tiếng Nhật',
          description: 'Hỗ trợ gõ tiếng Nhật online',
          title:"Hỗ trợ gõ tiếng Nhật online, Japanese input tools online,Hỗ trợ gõ tiếng Nhật cho web,Japanese input tools online for web",
          pr:"Công cụ hỗ trợ cho nhập liệu trên chrome google-cloud-input",
          dowloadpage:"Tới trang cài đặt"
        },
        ja: {
          welcome: '日本語入力',
          description: '日本語入力、日本語仮想キーボード,Đánh Tiếng Nhật có dấu',
          title:"日本語入力オンライン, Japanese input tools online,日本語入力WEB, Japanese input tools for web",
          pr:"クロムで入力ツール- google-cloud-input",
          dowloadpage:"インストールページへ"
        },

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
    routes: [
      '/',
      '/ja',
    ]
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
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
    }
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
