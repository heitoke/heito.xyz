export type TTypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

export interface IUserAvatar {
    type?: TTypeAvatar;
    size?: number;
    nameId?: string;
    square?: boolean;
    colors?: string[];
}

export function getAvatar(options: IUserAvatar = {}): string {
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

export function createHex(): string {
    return `#${Math.round((0x1000000 + 0xffffff * Math.random())).toString(16).slice(1)}`;
}

export function randomHexList(count: number = 8): string[] {
    return new Array(count).fill(1).map(() => createHex());
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

export function unix(unix: number = Date.now()) {
    let date = new Date(unix),
        year = date.getFullYear(),
        day = getString(date.getDate()),
        month = getString(date.getMonth()),
        hours = getString(date.getHours()),
        minutes = getString(date.getMinutes()),
        seconds = getString(date.getSeconds());

    // if (month < 10) month = `0${month}`;
    // if (day < 10) day = `0${day}`;
    // if (hours < 10) hours = `0${hours}`;
    // if (hours >= 24) hours = `0${hours - (new Number(24) as number)}`;
    // if (minutes < 10) minutes = `0${minutes}`;
    // if (minutes >= 60) minutes = `0${minutes - (new Number(60) as number)}`;
    // if (seconds < 10) seconds = `0${ seconds }`;
    // if (seconds >= 60) seconds = `0${seconds - (new Number(60) as number)}`;

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

export function unixFormat(time: number = Date.now(), format: string = 'd dd h hh m mm s ss MMM MMM YY YYYY'): string {
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