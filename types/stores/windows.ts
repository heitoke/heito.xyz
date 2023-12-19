export type Position = 'center' | 'top' | 'right' | 'bottom' | 'left';

export interface Button {
    icon: string;
    label?: string;
    text?: string;
    color?: string;
    click?(event: Event): void;
}

export interface WindowInfo {
    title: string;
    icon: string;
    image: string;
    description: string;
}

export interface WindowOptions {
    info?: WindowInfo;
    hide?: boolean;
    position?: Array<Position>;
    buttons?: Array<Button>;
}

export interface WindowTemplate extends WindowOptions {
    id: number;
    data: any;
    component: string;
    createdAt: number;
}

export type Window<T = string> = WindowTemplate;