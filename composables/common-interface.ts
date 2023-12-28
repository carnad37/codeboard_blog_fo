import {integer} from "vscode-languageserver-types";

// export interface LayoutSetting {
//     header: HeaderSetting
//     footer: FooterSetting
// }

// ======== ENUM ========

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

export enum SaveFormStatus {
    insert = 'insert', update = 'update', delete = 'delete'
}


// ======== INTERFACE ========

export interface PageData {
    pageIndex : number
    contentSize : number
    pageSize : number
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
    status? : SaveFormStatus
    contentOrder? : number
    langType? : string
}

export interface ArticleData {
    seq: number
    title: string
    contents?: Array<ArticleContent>
    summary: string
    publicFlag?: YN
    boardSeq?: number
    categorySeq?: number
    regUserSeq?: number
    uploadFiles?: number[]
    uploadContents?: SaveForm<ArticleContent>
}

export interface MenuData {
    seq: number
    title: string
    menuOrder: number
    parentSeq?: number
    regUserSeq: number
    publicFlag?: YN
    uuid?: string
    childrenList?: Array<MenuData>
}

export interface SaveForm<T> {
    insert: T[]
    update: T[]
    delete: T[]
}

export interface DataTableSort {
    key : string,
    order : 'asc' | 'desc'
}

export interface BlogFile {
    seq? : number,
    orgFileName? : string,
    savFileName? : string,
    fileType? : string,
    typeSeq? : number,
    fileSize? : number,
    mime? : string,
    ext? : string
}