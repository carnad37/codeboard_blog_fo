require('dotenv').config();


export default defineNuxtConfig({
    modules: [
      '@pinia/nuxt'
    ],
    pages: true,
    ssr: false,
    css: [
        'vuetify/lib/styles/main.sass',
        '@/assets/scss/common.scss',
        '@mdi/font/css/materialdesignicons.min.css',
    ],
    build: {
        transpile: ['vuetify'],
    },
    runtimeConfig: {
        public: {
            baseURL : process.env.GW_URL
        },
        custom: {
            user: {
                passwd: {
                    length : process.env.USER_RULE_PASSWD_LENGTH,
                    permitChar : process.env.USER_RULE_PERMIT_CHAR,
                }
            }
        }
    },
    vite: {
        server: {
          proxy: {
              "/auth": {
                  target: process.env.GW_URL,
                  changeOrigin: true
              },
              "/api" : {
                  target: process.env.GW_URL,
                  changeOrigin: true
              }
          },
        },
        define: {
            'process.env.DEBUG': false,
        },
    },
    // hooks: {
    //     'pages:extend' (routes) {
    //         //
    //     }
    // }
});