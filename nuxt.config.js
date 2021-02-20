require('dotenv').config();
import getAppRoutes from './server/modules/getRoutes';
import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import PurgecssPlugin from 'purgecss-webpack-plugin'
import glob from 'glob-all'
import path from 'path'

const modifyHtml = (html) => {
  // Add amp-custom tag to added CSS
  html = html.replace(/<style data-vue-ssr/g, '<style amp-custom data-vue-ssr')
  // Remove every script tag from generated HTML
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Add AMP script before </head>
  const ampScript = '<script async src="https://cdn.ampproject.org/v0.js"></script>'
  const ampSocial = '<script async custom-element="amp-social-share" src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>'
  html = html.replace('</head>', ampScript + ampSocial + '</head>')
  return html
}

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
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: 'logo.png' },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" },
      { rel: "apple-touch-startup-image", href: "/logo.png", media: "(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" },
    ]
  },
  // hooks: {
  //   // This hook is called before rendering the html to the browser
  //   'render:route': (url, page) => {
  //     page.html = modifyHtml(page.html)
  //   }
  // },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    // 'vuetify/dist/vuetify.css'
    // 'simplemde/dist/simplemde.min.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{ src: '~/plugins/fireinit.js' }, { src: '~/plugins/clientRender.js', mode: 'client' }],
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
    '@nuxtjs/component-cache',
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    '@nuxtjs/sitemap',
    '@nuxtjs/pwa',
    '@nuxtjs/amp',
    'nuxt-compress',
    // ['@nuxtjs/google-adsense', {
    //   id: 'ca-pub-9016732088039840'
    // }]
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
    meta: {
      mobileAppIOS:true
    },
    manifest: {
      name: 'Oboe',
      background_color: "#ffffff",
      lang: 'en',
      description: "cách nhớ kanji",
      display: "standalone",
      orientation: "portrait",
      prefer_related_applications: true,
      icons: [
        {
          "src": "/icon_1024.png",
          "sizes": "1024x1024",
          "type": "image/png"
        }
      ]
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
    // baseURL: 'http://localhost:8000/',
    // proxy: true,
    // proxyHeaders: false,
    // credentials: false
    headers: { "Cache-Control": "no-cache" },
    // disable the default cache and set the cache flag
    adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
      enabledByDefault: false,
      cacheFlag: "useCache"
    })
  },
  /*
  ** compress
  */
  "nuxt-compress": {
    gzip: {
      cache: true
    },
    brotli: {
      threshold: 10240
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    // treeShake: false,
    theme: {
      // disable: true,
      // this.$vuetify.theme.dark = true;
      dark: true,
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3
      //   }
      // }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: ['vue-instantsearch', 'instantsearch.js/es',/^vue2-google-maps($|\/)/],
    extractCSS: true,
    extend(config, { isDev, isClient }) {
      if (!isDev && isClient) {
        config.plugins.push(
          new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, './pages/**/*.vue'),
              path.join(__dirname, './layouts/**/*.vue'),
              path.join(__dirname, './components/**/*.vue')
            ]),
            whitelist: ['html', 'body']
          })
        )
      }
  }
  },
  /*
  ** render
  */
  render: {
    bundleRenderer: {
      // shouldPrefetch: (file, type) => ['script', 'style', 'font'].includes(type),
      // resourceHints:false
    },
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
