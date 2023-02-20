type TTypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

interface IUserAvatar {
    type?: TTypeAvatar;
    size?: number;
    nameId?: string;
    square?: boolean;
    colors?: string[];
}

function getAvatar(options: IUserAvatar = {}): string {
    let defaultValues: IUserAvatar = {
        type: 'beam',
        size: 128,
        nameId: 'guast',
        square: true,
        colors: ['0b0b0b', '171717', 'FFBF34']
    };
    options = { ...defaultValues, ...options }
    
    let { type, size, nameId, square, colors } = options;

    return `https://source.boringavatars.com/${type}/${size}/${nameId}?colors=${colors?.join(',')}&square=${square}`;
}

export {
    getAvatar
}