import {useUserAuth} from "~/composables/user-auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    await useUserAuth().check();
})