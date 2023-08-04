import VueRecaptchaPlugin from 'vue-recaptcha'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.use(VueRecaptchaPlugin, useRuntimeConfig().public.recaptcha)
})