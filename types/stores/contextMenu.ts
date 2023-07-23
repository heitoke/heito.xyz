export type TPosition = 'center' | 'top' | 'right' | 'bottom' | 'left' | 'corner' | 'fixed';

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
    children?: IContextMenuChildren;
}

export interface IComponent {
    component: Component | string;
    name: string;
    props?: {
        [key: string]: any;
    },
    events?: {
        [key: string]: (...args: any) => any;
    },
    slot?: string;
    style?: string;
}

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
    buttons?: IContextMenuButton[];
    components?: IComponent[];
}

type RemoveKeys = 'x' | 'y' | 'event' | 'position' | 'autoMaxWidth' | 'gap';

export interface IContextMenuChildren extends Omit<IContextMenu, RemoveKeys> {
    color?: string;
}