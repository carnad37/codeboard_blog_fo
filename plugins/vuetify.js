import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labsComponents from 'vuetify/labs/components'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components: {
            ...components, ...labsComponents
        },
        theme: {
            defaultTheme: 'light'
        },
        directives,
    })
    nuxtApp.vueApp.use(vuetify)
})