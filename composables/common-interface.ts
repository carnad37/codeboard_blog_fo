import {integer} from "vscode-languageserver-types";

// export interface LayoutSetting {
//     header: HeaderSetting
//     footer: FooterSetting
// }
export enum YN {
    Y = 'Y'
    , N = 'N'
}

export enum MenuType {
    BOARD = 'B'
    , MENU = 'M'
}

export enum EditorType {
    TextArea = 'TA'
    , CodeEditor = 'CE'
    , HTMLEditor = 'HE' // WYSIWYG
    , MarkdownEditor = 'ME'
    // 차후 추가
}


export interface HeaderSetting {
    title: string
    visible : boolean
    isSticky: boolean
}

export interface FooterSetting {
    visible : boolean
    isSticky: boolean
}

export interface CommonAlert {
    message : string,
    visible : boolean,
    callback : Function
}

export interface ArticleData {
    seq: number
    title: string
    content: string
    summary: string
    publicFlag?: YN
    boardSeq?: number
    categorySeq?: number
}

export interface MenuData {
    seq: number
    title: string
    menuOrder: number
    parentSeq?: number
    publicFlag?: YN
    uuid?: string
    childrenList?: Array<MenuData>
}

