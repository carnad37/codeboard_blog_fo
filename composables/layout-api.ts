import {defineStore} from "pinia";
import {CommonAlert, FooterSetting, HeaderSetting} from "~/composables/common-interface";

export const useLayoutStore = defineStore('layout-store', ()=>{
    const headerSetting : HeaderSetting = {title : '', visible: false, isSticky: false}
    const footerSetting : FooterSetting = {visible: false, isSticky: false}

    const enableHeader = (title : string, isSticky : boolean)=> {
        headerSetting.title = title
        headerSetting.visible = true
        headerSetting.isSticky = isSticky || false
    }

    const enableFooter = (isSticky : boolean)=> {
        footerSetting.visible = true
        footerSetting.isSticky = isSticky || false
    }

    const disableHeader = ()=> {
        headerSetting.title = ''
        headerSetting.visible = false
        headerSetting.isSticky = false
    }

    const disableFooter = () => {
        footerSetting.visible = false
        footerSetting.isSticky = false
    }

    return {
        header : headerSetting
        , footer : footerSetting
        , disableHeader
        , disableFooter
    }
})

export const useAlertStore = defineStore('alert-store', ()=>{
    // const alert : CommonAlert = reactive({visible : false, message : ''})
    const alert : CommonAlert = reactive({visible : false, message : '', callback : ()=>{}})
    const open = (message : string)=> {
        alert.message = message
        alert.visible = true
    }

    const openWithCallback = (message : string, callback : Function)=> {
        alert.message = message
        alert.callback = callback;
        alert.visible = true
    }

    const close = (message : string)=> {
        alert.visible = false
        alert.callback();
    }

    return {
        alert
        , open
        , openWithCallback
        , close
    };
})