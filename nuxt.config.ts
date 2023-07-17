export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt'
    ],
    // @ts-ignore
    pages: true,
    css: [
        'vuetify/lib/styles/main.sass',
        '@/assets/scss/common.scss',
        '@mdi/font/css/materialdesignicons.min.css',
    ],
    build: {
        transpile: ['vuetify'],
        parallel: true,
        cache: true,
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        }
    },
    runtimeConfig: {
        public: {
            baseURL : 'http://localhost:20000'
        }
    },
    vite: {
        server: {
          proxy: {
              "/auth": {
                  target: "http://localhost:20000",
                  changeOrigin: true
              },
              "/api" : {
                  target: "http://localhost:20000",
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