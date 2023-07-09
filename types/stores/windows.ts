import { DefineComponent } from "nuxt/dist/app/compat/capi";
import { Component } from "nuxt/schema";

export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export interface IButton {
    label?: string;
    text?: string;
    color?: string;
    icon: string;
    click?(e: Event): void;
}

export interface IWindow {
    id?: number;
    title?: string;
    message?: string;
    component: string;
    icon?: string;
    color?: string;
    position?: TPosition;
    hide?: boolean;
    data?: string | number | boolean | object;
    props?: object;
    buttons?: IButton[];
    error?: boolean;
    close?: boolean;
    createdAt?: number;
}