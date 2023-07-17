<script setup lang="ts">

import {CommonResponse, useCBFetch} from "~/composables/custom-fetch";
import {COMMON} from "~/constants/common";
import {LoginResponse} from "~/composables/user-auth";
import {VForm} from "vuetify/components/VForm";

// props
interface Props {
    modelValue?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: false
})

const emits = defineEmits(['update:modelValue'])

// constant
const width = 450;

// refs
const form = ref<VForm|null>(null)

// reactive
const tVisible = computed({
    get() {
        return props.modelValue
    },
    set(val : boolean) {
        emits('update:modelValue', val)
    }
})

const title = ref('')
const summary = ref('')
const content = ref('')

// pass const
const permitChar = '~!@#$%^&*()_+='
const passLenth : number = 8

</script>

<template>
    <v-dialog :max-width="width" class="mx-auto" v-model="tVisible" :persistent="true">
        <v-card>
            <v-form ref="form">
            <v-container class="pa-8">
                <v-row>
                    <v-col>
                        <v-text-field variant="underlined" label="제목" v-model="title" :clearable="true"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-textarea variant="outlined" label="요약" v-model="summary" :clearable="true"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-textarea variant="outlined" label="내용" v-model="content" :clearable="true"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="pb-6 text-center">
                        <v-btn variant="elevated" class="font-weight-bold text-h6" color="indigo-accent-4" @click.self.prevent="join">등록</v-btn>
                    </v-col>
                    <v-col class="pb-6 text-center">
                        <v-btn variant="elevated" height="60"  class="font-weight-bold text-h6" color="red-darken-1" @click="tVisible = false">닫기</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>