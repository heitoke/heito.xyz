import type { IMessage } from "~/windows/Message.vue";

export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export interface IButton {
    label?: string;
    text?: string;
    color?: string;
    icon: string;
    click?(e: Event): void;
}

export interface IWindowInfo {
    title: string;
    icon: string;
    img: string;
    description: string;
}

export interface Window<T = string> {
    id?: number;
    info?: IWindowInfo;
    title?: string;
    message?: string;
    component: T;
    icon?: string;
    color?: string;
    position?: TPosition;
    hide?: boolean;
    data?: string | number | boolean | object;
    props?: object;
    buttons?: IButton[];
    error?: boolean;
    close?: {
        enable?: boolean;
        button?: boolean;
    };
    createdAt?: number;
}

interface MessageWindow extends Window<'Message'> {
    data: IMessage;
}

export type IWindow = Window | MessageWindow;