import type * as Monaco from 'monaco-editor'
import { useState } from '#app'
import {defineStore} from "pinia";
import {editor} from "monaco-editor";
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import IEditorOverrideServices = editor.IEditorOverrideServices;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


export const useMonacoEditor = defineStore('monaco-store', ()=>{
    let monaco : typeof Monaco | null = null
    const set = (val : typeof Monaco) => {
        monaco = val
    }

    const get = () : typeof Monaco => {
        if (monaco == null) {
            throw new Error("no initiation manaco editor");
        } else {
            return monaco
        }
    }

    const create = (domElement: HTMLElement, contentCallback:()=>void, options?: IStandaloneEditorConstructionOptions, override?: IEditorOverrideServices) : IStandaloneCodeEditor => {
        if (monaco == null) {
            throw new Error("no initiation manaco editor");
        } else {
            const result = monaco.editor.create(domElement, options, override)
            if (result) {
                result.onDidChangeModelContent(contentCallback)
                onBeforeUnmount(()=>{
                    console.log("dispose!!")
                    result.dispose()
                })
                return result
            } else {
                throw new Error("Fail create manaco editor");
            }
        }
    }

    return {set, get, create};
})