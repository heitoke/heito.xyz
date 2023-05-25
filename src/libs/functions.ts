export type TTypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

export interface IUserAvatar {
    type?: TTypeAvatar;
    size?: number;
    nameId?: string;
    square?: boolean;
    colors?: string[];
}

export function getAvatar(options: IUserAvatar = {}): string {
    try {
        if (process) return '';
    } catch (err) {
        
    }

    let color = localStorage['color'],
        defaultValues: IUserAvatar = {
        type: 'beam',
        size: 512,
        nameId: 'guast',
        square: true,
        colors: ['0b0b0b', '171717', color ? JSON.parse(color)?.slice(1) : 'FFBF34'],
    };
    options = { ...defaultValues, ...options }
    
    let { type, size, nameId, square, colors } = options;

    return `https://source.boringavatars.com/${type}/${size}/${nameId}?colors=${colors?.join(',')}&square=${square}`;
}

export function createHex(): string {
    return `#${Math.round((0x1000000 + 0xffffff * Math.random())).toString(16).slice(1)}`;
}

export function randomHexList(count: number = 8): string[] {
    return new Array(count).fill(1).map(() => createHex());
}

export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

export function hexToRgb(hex: string): [number, number, number] {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

export function getAltColor(color: string): string {
    if (color[0] === '#') color = color.substring(1);
    let rgb = parseInt(color, 16),
        r = (rgb >> 16) & 0xff,
        g = (rgb >>  8) & 0xff,
        b = (rgb >>  0) & 0xff,
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return `#${luma < 40 ? 'ffffff' : '000000'}`;
}

export function addAlpha(color: string, opacity: number) {
    let _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);

    return color + _opacity.toString(16).toUpperCase();
}

export function uts(UT: number, one: string, two: string, five: string): string {
    if (`${UT}`.split('').reverse()[1] === '1') return `${UT}${five}`;
    if (`${UT}`.split('').reverse()[0] === '1') return `${UT}${one}`;
    if (+(`${UT}`.split('').reverse()[0]) >= 2 && +(`${UT}`.split('').reverse()[0]) <= 4) return `${UT}${two}`;
    return `${UT}${five}`;
}

export let monthsName: string[] = ['january', 'february', 'martha', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
export let miniMonthsName: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export function getString(input: number): string {
    return input < 10 ? `0${input}` : input.toString();
}

export function unix(unix: number | string = Date.now()) {
    let date = new Date(unix),
        year = date.getFullYear(),
        day = getString(date.getDate()),
        month = getString(date.getMonth()),
        hours = getString(date.getHours()),
        minutes = getString(date.getMinutes()),
        seconds = getString(date.getSeconds());

    return {
        year,
        day,
        month,
        month_name: monthsName[Number(month)],
        hours,
        minutes,
        seconds
    }
}

export interface IFormat {
    YYYY: string;
}

export function unixFormat(time: number | string = Date.now(), format: string = 'dd MMM YYYY'): string {
    let { year, day, month, hours, minutes, seconds } = unix(time),
        miniMonth = miniMonthsName[Number(month)],
        fullMonth = monthsName[Number(month)],
        types = {
        // * Year
        YYYY: year,
        YY: year.toString().slice(2),
        // * Month
        MMMM: fullMonth[0].toLocaleUpperCase() + fullMonth.slice(1),
        MMM: miniMonth[0].toLocaleUpperCase() + miniMonth.slice(1),
        // * Day
        dd: day,
        d: Number(day),
        // * Hour
        hh: hours,
        h: Number(hours),
        // * Minute
        mm: minutes,
        m: Number(minutes),
        // * Second
        ss: seconds,
        s: Number(seconds),
    };

    // @ts-ignore
    return format.replace(new RegExp(`${Object.keys(types).join('|')}`, 'g'), (s: string) => types[s]);
}

export function timeago(time: number = Date.now()) {
    let msPerMinute = 60 * 1000,
        msPerHour = msPerMinute * 60,
        msPerDay = msPerHour * 24,
        elapsed = Date.now() - (new Date(time) as any);
    
    if (elapsed / 1000 < 3) return 'just now';
    
    if (elapsed < msPerMinute) return `${uts(Math.round(elapsed / 1000), ' second', ' seconds', ' seconds')} ago`;
    else if (elapsed < msPerHour) return `${uts(Math.round(elapsed / msPerMinute), ' minute', ' minutes', ' minutes')} ago`;
    else if (elapsed < msPerDay) return `${uts(Math.round(elapsed / msPerHour), ' hour', ' hours', ' hours')} ago`;
    else {
        let { day, month_name, year } = unix(time);
        return `${day} ${month_name} ${year}`;
    }
}




// export function setCookie(name: string, value: string, days: number) {
//     let expires = '';

//     if (days) {
//         let date = new Date();

//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = '; expires=' + date.toUTCString();
//     }
    
//     document.cookie = name + "=" + (value || "")  + expires + "; path=/";
// }

// export function getCookie(name: string) {
//     var nameEQ = name + "=";
//     var ca = document.cookie.split(';');
//     for(var i=0;i < ca.length;i++) {
//         var c = ca[i];
//         while (c.charAt(0)==' ') c = c.substring(1,c.length);
//         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
//     }
//     return null;
// }
export interface ICookieOptions {
    secure?: boolean;
    'max-age'?: number;
    expires?: Date | string;
    path?: string;
    days?: number;
}
export function setCookie(name: string, value: string, options: ICookieOptions = {}) {
    options = { path: '/', ...options };
  
    if (options.expires instanceof Date) {
        options['expires'] = options.expires.toUTCString();
    }

    if (options.days) {
        const date = new Date();

        date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
        options['expires'] = date.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
  
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;

        // @ts-ignore
        const optionValue = options[optionKey];

        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
  
    document.cookie = updatedCookie;
}

export function getCookie(name: string) {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(names: Array<string>) {
    for (const name of names) {
        setCookie(name, '', { 'max-age': -1 });
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
    } catch (error) {
        return false;
    }
}