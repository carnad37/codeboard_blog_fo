import {defineStore} from "pinia";
import {CommonAlert, FooterSetting, HeaderSetting} from "~/composables/common-interface";

export const useLayoutStore = defineStore({
    id: 'layout-store',
    state: ()=>{
        const headerSetting : HeaderSetting = {visible: false, length: 7}
        const footerSetting : FooterSetting = {visible: true, isSticky: false}
        return {headerSetting, footerSetting}
    },
    actions: {
        setHeaderVisible(bool : boolean) {
            this.headerSetting.visible = bool
        },
        setFooterVisible(bool : boolean) {
            this.footerSetting.visible = bool
        },
    },
    getters: {
        header: state => readonly(state.headerSetting),
        footer: state => readonly(state.footerSetting),
    }

})

export const useAlertStore = defineStore('alert-store', ()=>{
    const alert : CommonAlert = reactive({visible : false, message : ''})
    const open = (message : string)=> {
        alert.message = message
        alert.visible = true
        // alert.callback = ()=>{}
    }

    const openWithCallback = (message : string, callback : Function)=> {
        alert.message = message
        alert.visible = true
        // alert.callback = callback;
    }

    const close = (message : string)=> {
        alert.visible = false
        // alert.callback();
    }

    return {alert : alert, open, openWithCallback, close};
})
