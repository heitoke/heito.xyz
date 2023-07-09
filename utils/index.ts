export type TTypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

export interface IUserAvatar {
    type?: TTypeAvatar;
    size?: number;
    nameId?: string;
    square?: boolean;
    colors?: string[];
}

export function getAvatar(options: IUserAvatar = {}): string {
    const
        color = process.client ? (localStorage.getItem('color') ? JSON.parse(localStorage['color'])?.slice(1) : 'FFBF34') : 'FFBF34',
        defaultValues: IUserAvatar = {
            type: 'beam',
            size: 512,
            nameId: 'guast',
            square: true,
            colors: ['0b0b0b', '171717', color],
        };

    options = { ...defaultValues, ...options }
    
    let { type, size, nameId, square, colors } = options;

    return `https://source.boringavatars.com/${type}/${size}/${nameId}?colors=${colors?.join(',')}&square=${square}`;
}

export function redirect(path: string, target: 'self' | 'blank' | 'top' | 'parent' = 'blank') {
    try {
        window.open(path, `_${target}`);
    } catch (_) {
        return false;
    }
}

export function copy(content: string) {
    try {
        const input = document.createElement('textarea');
        input.innerHTML = content;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
    } catch (_) {
        return false;
    }
}