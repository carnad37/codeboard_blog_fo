import {VForm} from "vuetify/components/VForm";

export const useValidateForm = async (form : Ref<VForm|null>) : Promise<boolean> =>{
    let result = false
    if (form.value != null) {
        const { valid } = await form.value.validate()
        result = valid;
    }
    return result
}