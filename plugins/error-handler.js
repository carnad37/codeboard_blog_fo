export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('vue:error', (..._args) => {
        console.log(_args)
        // if (process.client) {
        //   console.log(..._args)
        // }
    })
    nuxtApp.hook('app:error', (error) => {
        // if (useRoute().fullPath === '/') {
        //     console.error("루트에서 에러 발생, 처리 확인")
        // }
        // if (error.statusCode === 404) {
        //     // 무한루프를 막기위해서인지 /일경우 /로 이동시키지 않는다.
        //     location.href = '/'
        // }
        console.log('app:error')
    })
    nuxtApp.vueApp.config.errorHandler = (..._args) => {
        console.log('global error handler')
        // if (process.client) {
        //   console.log(..._args)
        // }
    }
})