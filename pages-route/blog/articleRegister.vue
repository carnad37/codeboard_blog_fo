<script setup lang="ts">
import {useCBFetch} from "~/composables/custom-fetch";
import {VForm} from "vuetify/components/VForm";
import {
    ArticleContent,
    ArticleData,
    EditorType,
    MenuData,
    SaveForm,
    SaveFormStatus,
    YN
} from "~/composables/common-interface";
import EditorSelector from "~/components/common/EditorSelector.vue";
import {useAlertStore, useLayoutStore, useLoading} from "#imports";
import {VCard} from "vuetify/components";


definePageMeta({
    layout: 'menu-layout',
    middleware: 'auth'
})
useLayoutStore().enableHeader({
    title: '테스트'
})

// computed
const articleSeq = computed(()=>{
    if (useRoute().params.articleSeq) {
        return usePaser().strToNum(useRoute().params.articleSeq as string);
    } else {
        return 0
    }
})
const boardSeq = computed(()=>{
    if (useRoute().params.boardSeq) {
        return usePaser().strToNum(useRoute().params.boardSeq as string);
    } else {
        throw new Error('잘못된 파라미터입니다.')
    }
})

const isEdit = computed(()=>{
    return articleSeq.value > 0
})

// ref
const testDiv = ref()
const articleInfo = ref<ArticleData>({
    seq : articleSeq.value,
    title : '',
    summary : '',
    boardSeq : boardSeq.value,
    publicFlag : YN.Y,
    contents : [{
        content: '',
        status: SaveFormStatus.insert,
        editor: EditorType.TextArea,
        contentOrder: 0
    }],
})

// 입력관련
const form = ref<VForm|null>(null)

const articleSave = async ()=>{
    if (await useValidateForm(form)) {
        // 콘텐츠 초기화
        const contentForm : SaveForm<ArticleContent> = {
            insert : [],
            update : [],
            delete : [],
        }

        if (!articleInfo.value.contents || articleInfo.value.contents?.length < 1) {
            useAlertStore().open("컨텐츠 정보가 부족합니다.")
            return
        }

        // 콘텐츠값 정렬
        // update된 내용 비교 필요.
        for (let idx=0; idx<articleInfo.value.contents.length; idx++) {
            const targetContent = articleInfo.value.contents[idx]
            targetContent.contentOrder = idx
            if (targetContent?.status) {
                contentForm[targetContent.status].push(targetContent)
            }
        }

        // isEdit일경우 SaveForm으로 콘텐츠 정보 수정
        const param : ArticleData = {
            seq : isEdit.value ? articleInfo.value.seq : 0
            , boardSeq : articleInfo.value.boardSeq
            , title: articleInfo.value.title
            , summary: articleInfo.value.summary
            , publicFlag : articleInfo.value.publicFlag
            , uploadContents : contentForm
        }
        // const api = isEdit.value ? useCBFetch().put : useCBFetch().post
        const result = await useCBFetch().post<ArticleData>('/api/blog/private/article/save', {body: param})
        if (result.success) {
            useAlertStore().open('저장했습니다.')
            if (isEdit.value) {
                await refreshArticle();
            } else if (result.data?.data && result.data.data.seq > 0) {
                const tData = result.data?.data;
                await useRouter().replace({path : `/article/${tData?.boardSeq}/insert/${tData?.seq}`})
            }
        }
    }
}

const refreshArticle = async ()=>{
    useLoading().start()
    // 한번 초기화해줘야한다.
    articleInfo.value.contents = []
    const result = await useCBFetch().get<ArticleData>('/api/blog/private/article/find', {params: {seq : articleInfo.value.seq}})
    if (result.data?.data) {
        const articleData = result.data.data
        articleInfo.value.title = articleData.title
        articleInfo.value.boardSeq = articleData.boardSeq
        articleInfo.value.summary = articleData.summary
        articleInfo.value.contents = articleData.contents?.length
            ? articleData.contents
            : [{
                content: '',
                status: SaveFormStatus.insert,
                editor: EditorType.TextArea,
                contentOrder: 0
            }]
    }
    useLoading().stop()
}

const addEditor = (index : number)=>{
    const targetList = articleInfo.value.contents || []
    targetList.splice(index + 1, 0, {
        articleSeq: isEdit.value ? articleInfo.value.seq || 0 : 0,
        content: '',
        editor: EditorType.TextArea,
        status: SaveFormStatus.insert
    })
}
const delEditor = (index : number)=>{
    const contents = articleInfo.value.contents || []
    const contentsLength = contents.filter(x=>x.status !== SaveFormStatus.delete).length
    if (contentsLength > 1) {
        const targetContent = contents[index]
        if (targetContent.seq) {
            // 등록되어있던 콘텐츠
            targetContent.status = SaveFormStatus.delete
        } else {
            // 서버 데이터가 아닌경우 그냥 삭제
            contents.splice(index, 1)
        }
    } else {
        useAlertStore().open('콘텐츠는 하나이상 입력되어야합니다.')
    }
}
const movePrev = (idx : number)=>{
    const targetList = articleInfo.value.contents || []
    if (targetList.length > 1 && idx !== 0) {
        const keep = targetList[idx - 1]
        targetList[idx - 1] = targetList[idx]
        targetList[idx] = keep
    }
}
const moveNext = (idx : number)=>{
    const targetList = articleInfo.value.contents || []
    if (targetList.length > 1 && targetList.length - 1 !== idx) {
        const keep = targetList[idx + 1]
        targetList[idx + 1] =  targetList[idx]
        targetList[idx] = keep
    }
}

// created
if (isEdit.value) {
    console.log("edit!")
    // 값지정 실제 컨텐츠 가져옴
    await refreshArticle();
}


</script>

<template>
<!--    <v-dialog class="mx-auto my-auto" :scrollable="true" v-model="tVisible" :persistent="true">-->
        <v-card class="article-editor" ref="testDiv">
            <v-form ref="form">
                <v-container class="pa-8">
                    <v-row>
                        <v-col>
                            <v-text-field variant="underlined" label="제목" v-model="articleInfo.title" :clearable="true"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-radio-group label="공개여부" v-model="articleInfo.publicFlag">
                                <v-radio label="공개" :value="YN.Y"></v-radio>
                                <v-radio label="비공개" :value="YN.N"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea variant="outlined" label="요약" v-model="articleInfo.summary" auto-grow :clearable="true"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-divider class="ma-3" :style="{'border-color': 'black', 'opacity' : '1'}" thickness="2">텍스트</v-divider>
                    </v-row>
                    <template v-for="(item, cIdx) in articleInfo.contents">
                        <v-row v-if="item.status !== SaveFormStatus.delete" :key="`editor-selector-${cIdx}`">
                            <v-col>
                                <EditorSelector
                                    :editor="item"
                                    :editor-index="cIdx"
                                    :key="`editor_${item.seq || 0}_${cIdx}`"
                                    @add-editor="addEditor(cIdx)"
                                    @del-editor="delEditor(cIdx)"
                                    @move-prev="movePrev(cIdx)"
                                    @move-next="moveNext(cIdx)"
                                    :is-first="cIdx === 0"
                                    :is-last="(articleInfo.contents?.length || 0 - 1) === cIdx"
                                />
                            </v-col>
                        </v-row>
                    </template>
                    <v-row>
                        <v-col class="pb-6 text-center">
                            <v-btn variant="elevated" height="45" width="80" class="font-weight-bold text-h6 mr-2" color="indigo-accent-4" @click.self.prevent="articleSave()" v-text="isEdit ? '수정' : '등록'"></v-btn>
                            <v-btn variant="elevated" height="45" width="80" class="font-weight-bold text-sm-button" color="indigo-accent-4" @click.self.prevent="useRouter().push({path:`/article/${articleInfo.boardSeq}/list`})" v-text="'뒤로가기'"></v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card>
<!--    </v-dialog>-->
</template>

<style>
.article-editor {
    width: 80%;
    height: 100%;
    margin: auto;
}
@media screen and (max-width: 900px) {
    .article-editor {
        width: 100%;
        .v-overlay__content {
            width: 100% !important;
            max-width: 100% !important;
        }
    }
}
/*
//@media screen and (max-width: 600px) {
//    .article-editor {
//        height: 100vh;
//        .v-overlay__content {
//            max-height: 100%;
//            margin: 0;
//        }
//    }
//}
*/
</style>