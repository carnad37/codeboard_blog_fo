import {integer} from "vscode-languageserver-types";

// export interface LayoutSetting {
//     header: HeaderSetting
//     footer: FooterSetting
// }

export enum UserAuth {
    MEMBER = 'M',
    ADMIN = 'A',
    ANONYMOUS = ''
}

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

export enum EditorCodeLang {
    HTML = 'html',
    CSS = 'css',
    SCSS = 'scss',
    JAVASCRIPT = 'javascript',
    TYPESCRIPT = 'typescript',
    JAVA = 'java',
    MYSQL = 'mysql',
    POSTGRESQL = 'pg',
    PYTHON = 'python'
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

export interface ArticleContent {
    seq?: number
    articleSeq?: number
    content : string
    editor : EditorType
}

export interface ArticleData {
    seq: number
    title: string
    contents: Array<ArticleContent>
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

export interface SaveForm<T> {
    insert: T[]
    update: T[]
    delete: T[]
}