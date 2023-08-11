import { resolve } from 'path';

export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        'vue-recaptcha/nuxt'
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
    alias: {
    },
    app: {
        head: {
            script: [
                {
                    src: 'https://www.google.com/recaptcha/api.js?render=6LcJoXwnAAAAAN2BMtKP-TbwLnh85OHgveoD-_D5'
                    , defer: true
                }
            ]
        }
    },
    runtimeConfig: {
        public: {
            baseURL : process.env.GW_URL,
            recaptcha: {
                v2SiteKey: process.env.RECAPTCHA_KEY
            },
            custom: {
                user: {
                    passwd: {
                        length : process.env.USER_RULE_PASSWD_LENGTH,
                        permitChar : process.env.USER_RULE_PERMIT_CHAR,
                    }
                },
            },

        },
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
    hooks: {
        'pages:extend' (pages) {
            pages.push(
                {
                    name: 'BoardArticle',
                    path: '/article/:seq',
                    file: resolve(__dirname, './pages-route/blog/article')
                },
                {
                    name: 'BoardArticleList',
                    path: '/article/:boardSeq/list',
                    file: resolve(__dirname, './pages-route/blog/articleList')
                },
                {
                    name: 'BoardMenuRootList',
                    path: '/menu/list',
                    file: resolve(__dirname, './pages-route/blog/menuList')
                },
                {
                    name: 'BoardMenuList',
                    path: '/menu/:boardSeq/list',
                    file: resolve(__dirname, './pages-route/blog/menuList')
                }
            )
        }
    }
});