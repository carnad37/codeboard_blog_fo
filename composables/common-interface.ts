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

export interface CommonSetting {
    // title: string,
    visible: boolean
}

export interface HeaderSetting extends CommonSetting {
    length: number
}

export interface FooterSetting extends CommonSetting {
    isSticky: boolean
}

export interface CommonAlert {
    message : string,
    visible : boolean,
}