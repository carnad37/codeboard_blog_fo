import {VForm} from "vuetify/components/VForm";
import {CommonAlert} from "~/composables/common-interface";
import {defineStore} from "pinia";
import {ComputedRef, EmitsOptions, WritableComputedRef} from "vue";

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
                callback(token)
            }
        );
    });
    return result;
}

/**
 * 특정 통신기능동안 다른기능을 막아야할 경우 사용(중복 API사용 방지)
 */
export const useApiProcess = defineStore('api-process-store', ()=>{
    // const alert : CommonAlert = reactive({visible : false, message : ''})
    let isNetworkProcessing = ref(false)

    const process = async (callback : Function) => {
        if (!isNetworkProcessing.value) {
            isNetworkProcessing.value = true
            await callback();
            isNetworkProcessing.value = false
        }
    }

    const forcedStop = () => {
        isNetworkProcessing.value = false
    }

    return {process, forcedStop};
})

/**
 * v-model용 공용 기능
 */
export const useModelValue =  defineStore('api-model-value', <T>()=>{
    // const alert : CommonAlert = reactive({visible : false, message : ''})
    type Props = {
        modelValue : T
    }

    type Result = {
        props : Props
        computedValue : WritableComputedRef<T>
    }

    const init = () : Result => {
        const props = defineProps<Props>()
        const emits = defineEmits(['update:modelValue'])
        const computedValue = computed({
            get() {
                return props.modelValue
            },
            set(val) {
                return emits('update:modelValue', val)
            }
        })
        return {
            props,
            computedValue
        }
    }

    return {init};
})
