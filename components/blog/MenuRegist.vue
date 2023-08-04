<script setup lang="ts">

import {CommonResponse, useCBFetch} from "~/composables/custom-fetch";
import {COMMON} from "~/constants/common/common";
import {LoginResponse} from "~/composables/user-auth";
import {VForm} from "vuetify/components/VForm";
import {ArticleData} from "~/pages/blog/list.vue";
import {WritableComputedRef} from "@vue/reactivity";

// props
interface Props {
    modelValue?: boolean
    articleData: ArticleData | null
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    articleData: null
})

const emits = defineEmits(['update:modelValue'])

// constant
const width = 450;

// refs
const form = ref<VForm|null>(null)

// reactive
const isEdit = computed(()=>{
    return props.articleData !== null
})
const tVisible = computed({
    get() {
        return props.modelValue
    },
    set(val : boolean) {
        emits('update:modelValue', val)
    }
})

// data
const title = ref('')
const summary = ref('')
const content = ref('')

// method
const articleSave = async ()=>{
    if (await useValidateForm(form)) {
        const param = {title: title.value, summary: summary.value, content: content.value}
        const result = await useCBFetch.post<ArticleData>('/api/blog/private/article/save', {body: param})
        // let responseArticle = new ArticleData();
        // if (result.data?.data) {
        //     responseArticle = result.data.data
        // } else return
        // 부모 리스트 재로딩
    }
}

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
                        <v-btn variant="elevated" height="45" width="80"  class="font-weight-bold text-h6" color="indigo-accent-4" @click.self.prevent="articleSave()" v-text="isEdit ? '수정' : '등록'"></v-btn>
                    </v-col>
                    <v-col class="pb-6 text-center">
                        <v-btn variant="elevated" height="45" width="80"  class="font-weight-bold text-h6" color="red-darken-1" @click="tVisible = false">닫기</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>