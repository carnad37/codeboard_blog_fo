import {defineStore} from "pinia";
import {CommonAlert, FooterSetting, HeaderSetting} from "~/composables/common-interface";
import {LayoutKey} from "#build/types/layouts";
import {NavigationGuard} from "vue-router";
import {MiddlewareKey} from "#build/types/middleware";

export const useLayoutStore = defineStore('layout-store', ()=>{
    const headerSetting = reactive({title : '', visible: false, isSticky: false})
    const footerSetting = reactive({visible: false, isSticky: false})

    const enableHeader = ({title, isSticky} : {title : string, isSticky? : boolean})=> {
        headerSetting.title = title
        headerSetting.visible = true
        headerSetting.isSticky = isSticky || false
    }

    const enableFooter = ({isSticky} : {isSticky? : boolean})=> {
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
        header : readonly(headerSetting)
        , footer : readonly(footerSetting)
        , enableHeader
        , enableFooter
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

export const useLoading = defineStore('loading-store', ()=>{
    // const alert : CommonAlert = reactive({visible : false, message : ''})
    const loading = reactive({visible : false})

    const start = ()=>{
        loading.visible = true
    }

    const stop = ()=>{
        loading.visible = false
    }

    const isVisible = ()=>{
        return loading.visible
    }

    return {
        start, stop, isVisible
    };
})