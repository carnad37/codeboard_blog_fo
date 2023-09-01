import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import {useMonacoEditor} from "~/composables/editor-store";

export default defineNuxtPlugin(async (nuxtApp) => {

    self.MonacoEnvironment = {
        getWorker (workerId: string, label: string) {
            switch (label) {
                case 'json':
                    return new jsonWorker();
                case 'css':
                case 'scss':
                case 'less':
                    return new cssWorker();
                case 'html':
                case 'handlebars':
                case 'razor':
                    return new htmlWorker();
                case 'typescript':
                case 'javascript':
                    return new tsWorker();
                default:
                    return new editorWorker();
            }
        }
    }
    // 해당 모듈을 pinia에 담아서 사용
    useMonacoEditor().set(await import('monaco-editor'))
})