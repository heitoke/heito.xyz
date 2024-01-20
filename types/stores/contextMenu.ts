import type { Component, StyleValue } from 'vue';

export type Position = 'center' | 'top' | 'right' | 'bottom' | 'left' | 'corner' | 'fixed';

export type ItemType = 'button' | 'separator' | 'component' | 'radio' | 'checkbox' | 'children';

interface ItemTemplate<Type extends ItemType> {
    type: Type;
    label: string;
    text?: string;
    color?: string;
    icon?: string;
    image?: string;
}

export interface ItemButton extends ItemTemplate<'button'> {
    click?(event: MouseEvent): void;
}

export interface ItemSeparator extends Pick<ItemTemplate<'separator'>, 'type'> {}

export interface ItemComponent extends ItemTemplate<'component'> {
    name: string;
    component: string | Component;
    style?: StyleValue;
    props?: {
        [key: string]: any;
    };
    events?: {
        [key: string]: (...args: Array<any>) => void;
    }
}

export interface ItemRadio<T = string | number> extends ItemTemplate<'radio'> {
    name: string;
    value: T;
    ref: T | Ref<T>;
    click?(value: T, event: MouseEvent): void;
}

export interface ItemCheckbox extends ItemTemplate<'checkbox'> {
    name?: string;
    value?: boolean | Ref<boolean>;

    click?(value: boolean, event: MouseEvent): void;
}

export interface ItemChildren extends ItemTemplate<'children'> {
    items: Array<Item>;
}

export type Item = ItemButton
| ItemSeparator
| ItemComponent
| ItemRadio
| ItemCheckbox
| ItemChildren;

export interface ContextMenu {
    name: string;
    title?: string;
    text?: string;
    event?: Event | MouseEvent | Element | HTMLElement;
    position?: Array<Position>;
    x?: number;
    y?: number;
    items: Array<Item>;
}