import type { Slot } from "nuxt/dist/app/compat/capi";

export type TPosition = 'center' | 'top' | 'right' | 'bottom' | 'left' | 'corner' | 'fixed';

type RemoveKeys = 'x' | 'y' | 'event' | 'position' | 'autoMaxWidth' | 'gap';

export interface ItemChildren extends Omit<IContextMenu, RemoveKeys> {
    color?: string;
}

export type TItem = 'button' | 'component' | 'separator';

interface ItemType<T = TItem> {
    type: T;
}

export interface ItemButton extends ItemType<'button'> {
    label: string;
    text?: string;
    icon?: string;
    img?: string;
    color?: string;
    value?: object | string | number | boolean;
    click?(event: Event): void;
    checkbox?(value: boolean): void;
    children?: ItemChildren;
}

export interface ItemComponent extends ItemType<'component'> {
    name: string;
    component: string | Component;
    props?: {
        [key: string]: any;
    };
    events?: {
        [key: string]: (...args: any) => void;
    };
    slots?: {
        default: Slot;
        [key: string]: Slot;
    };
    style?: string;
}

export interface ItemSeparator extends ItemType<'separator'> {
    color?: string;
    margin?: string;
}

export type Item = ItemButton | ItemComponent | ItemSeparator;

export interface IContextMenu {
    name: string;
    title?: string;
    text?: string;
    event?: Event | MouseEvent | Element;
    position?: Array<TPosition>;
    gap?: [number, number];
    x?: number;
    y?: number;
    autoMaxWidth?: boolean;
    items: Array<Item>;
}