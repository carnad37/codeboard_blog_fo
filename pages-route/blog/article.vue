<script setup lang="ts">
import {ArticleData, EditorType, YN} from "~/composables/common-interface";
import {useCBFetch} from "~/composables/custom-fetch";
import {marked} from 'marked';
import EditorCode from "~/components/common/EditorCode.vue";

interface PostData {
  seq: number
  title: string
  content: string
  summary: string
  publicFlag: YN
  boardSeq: number
  categorySeq: number
}

definePageMeta({
 layout: 'menu-layout'
})

const articleSeq = useRoute().params.articleSeq
let resultSeq = 0
try {
    resultSeq = parseInt(articleSeq as string)
} catch (e) {
    throw new Error('잘못된 접근입니다.')
}

const articleResult = await useCBFetch().get<ArticleData>('/api/blog/public/article/find', {params: {seq : resultSeq}})
if (!articleResult.data?.data) {
    throw new Error('잘못된 접근입니다.')
}

const articleInfo = ref(articleResult.data.data)
const markedPaser = marked.parse

</script>

<template>
    <div class="article-wrapper pl-12 pr-12">
        <div class="article-header mt-7">
            <div class="text-h4" v-text="articleInfo.title"/>
        </div>
        <v-expansion-panels v-if="articleInfo.summary" class="article-summary mt-5 pr-5 pl-5" variant="accordion" >
            <v-expansion-panel>
                <v-expansion-panel-title style="min-height: 0">
                    요약
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <div class="mt-3">
                        {{ articleInfo.summary }}
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-divider class="mt-5" thickness="2"></v-divider>
        <div ref="test"></div>
        <template v-for="(content, idx) in articleInfo.contents">
            <editor-code v-if="content.editor === EditorType.CodeEditor" :readonly="true" :model-value="content.content" :language="'java'" :height="400"/>
            <div v-else class="article-content mt-5" v-html="content.editor === EditorType.MarkdownEditor ? markedPaser(content.content) : content.content"/>
        </template>
        <div class="article-footer text-center mt-5">
            <v-btn @click.prevent="useRouter().push(`/article/${articleInfo.boardSeq}/edit/${articleInfo.seq}`)">수정</v-btn>
        </div>
        <div class="article-comment">

        </div>

    </div>
</template>

<style lang="scss" scoped>
// 블록 스타일적용
::v-deep(.article-content) {
    code,
    pre{
        color: black;
        background: none;
        text-shadow: 0 1px white;
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 1em;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;

        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;

        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
    }


    pre::-moz-selection, pre ::-moz-selection,
    code::-moz-selection, code ::-moz-selection {
        text-shadow: none;
        background: #b3d4fc;
    }

    pre::selection, pre::selection,
    code::selection, code::selection {
        text-shadow: none;
        background: #b3d4fc;
    }

    @media print {
        code,
        pre {
            text-shadow: none;
        }
    }

    /* Code blocks */
    pre {
        padding: 1em;
        margin: .5em 0;
        overflow: auto;
        background: #f5f2f0;
    }

    :not(pre) > code {
        background: #f5f2f0;
    }

    /* Inline code */
    :not(pre) > code {
        padding: .1em;
        border-radius: .3em;
        white-space: normal;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: slategray;
    }

    .token.punctuation {
        color: #999;
    }

    .token.namespace {
        opacity: .7;
    }

    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol,
    .token.deleted {
        color: #905;
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
        color: #690;
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
        color: #9a6e3a;
        /* This background color was intended by the author of this theme. */
        background: hsla(0, 0%, 100%, .5);
    }

    .token.atrule,
    .token.attr-value,
    .token.keyword {
        color: #07a;
    }

    .token.function,
    .token.class-name {
        color: #DD4A68;
    }

    .token.regex,
    .token.important,
    .token.variable {
        color: #e90;
    }

    .token.important,
    .token.bold {
        font-weight: bold;
    }
    .token.italic {
        font-style: italic;
    }

    .token.entity {
        cursor: help;
    }
}


</style>
