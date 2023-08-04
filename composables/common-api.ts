import {VForm} from "vuetify/components/VForm";

export const useValidateForm = async (form : Ref<VForm|null>) : Promise<boolean> =>{
    let result = false
    if (form.value != null) {
        const { valid } = await form.value.validate()
        result = valid;
    }
    return result
}

export const useRecaptcha = (callback : (token:string) => void)=>{
    let result = null;
    // @ts-ignore
    grecaptcha.ready(function() {
        // @ts-ignore
        grecaptcha.execute(useRuntimeConfig().public.custom.config.recatpchaKey, {action: 'submit'})
            .then(function(token : string) {
                console.log(token)
                callback(token)
            }
        );
    });
    return result;
}