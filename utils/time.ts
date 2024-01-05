export interface IFormat {
    YYYY: string;
}

class Time {
    readonly monthsName: string[] = ['january', 'february', 'martha', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    readonly miniMonthsName: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    constructor() {}

    uts(UT: number, one: string, two: string, five: string): string {
        if (`${UT}`.split('').reverse()[1] === '1') return `${UT}${five}`;
        if (`${UT}`.split('').reverse()[0] === '1') return `${UT}${one}`;
        if (+(`${UT}`.split('').reverse()[0]) >= 2 && +(`${UT}`.split('').reverse()[0]) <= 4) return `${UT}${two}`;
        
        return `${UT}${five}`;
    }

    private getString(input: number): string {
        return input < 10 ? `0${input}` : input.toString();
    }

    unix(unix: number | string | Date = Date.now()) {
        let date = new Date(unix),
            year = date.getFullYear(),
            day = this.getString(date.getDate()),
            month = this.getString(date.getMonth()),
            hours = this.getString(date.getHours()),
            minutes = this.getString(date.getMinutes()),
            seconds = this.getString(date.getSeconds());
    
        return {
            year,
            day,
            month,
            month_name: this.monthsName[Number(month)],
            hours,
            minutes,
            seconds
        }
    }

    format(time: number | string = Date.now(), format: string = 'dd MMM YYYY'): string {
        let { year, day, month, hours, minutes, seconds } = this.unix(time),
            miniMonth = this.miniMonthsName[Number(month)],
            fullMonth = this.monthsName[Number(month)];

        const types = {
            // * Year
            YYYY: year,
            YY: year.toString().slice(2),
            // * Month
            mmmm: fullMonth,
            MMMM: fullMonth[0].toLocaleUpperCase() + fullMonth.slice(1),
            mmm: miniMonth,
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

    timeago(time: number | Date = Date.now()) {
        let msPerMinute = 60 * 1000,
            msPerHour = msPerMinute * 60,
            msPerDay = msPerHour * 24,
            elapsed = Date.now() - (new Date(time) as any);
        
        if (elapsed / 1000 < 3) return 'just now';
        
        if (elapsed < msPerMinute) return `${this.uts(Math.round(elapsed / 1000), ' second', ' seconds', ' seconds')} ago`;
        else if (elapsed < msPerHour) return `${this.uts(Math.round(elapsed / msPerMinute), ' minute', ' minutes', ' minutes')} ago`;
        else if (elapsed < msPerDay) return `${this.uts(Math.round(elapsed / msPerHour), ' hour', ' hours', ' hours')} ago`;
        else {
            let { day, month_name, year } = this.unix(time);
            return `${day} ${month_name} ${year}`;
        }
    }
}

export const time = new Time();