export type TPosition = 'center' | 'top' | 'right' | 'bottom' | 'left' | 'fixed-target';

export interface IContextMenuButton {
    label: string;
    text?: string;
    icon?: string;
    img?: string;
    color?: string;
    component?: string | Component;
    separator?: boolean;
    value?: object | number | string;
    click?(e?: Event): void;
    checkbox?(value?: boolean): void;
    children?: IContextMenu;
}

export interface IComponent {
    component: Component | string;
    name: string;
    props?: {
        [key: string]: any;
    },
    events?: {
        [key: string]: (...args: any) => any;
    }
}

export interface IContextMenu {
    name: string;
    title?: string;
    text?: string;
    event?: Event | MouseEvent | Element;
    position?: Array<TPosition>;
    x?: number;
    y?: number;
    autoMaxWidth?: boolean;
    buttons?: IContextMenuButton[];
    components?: IComponent[];
}