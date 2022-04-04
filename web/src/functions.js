export default {
    uts(UT, one, two, five) {
        if (`${ UT }`.split('').reverse()[ 1 ] === '1') return `${ UT }${ five }`;
        if (`${ UT }`.split('').reverse()[ 0 ] === '1') return `${ UT }${ one }`;
        if (+(`${ UT }`.split('').reverse()[ 0 ]) >= 2 && +(`${ UT }`.split('').reverse()[ 0 ]) <= 4) return `${ UT }${ two }`;
        return `${ UT }${ five }`;
    },
    timeago(time) {

        if (!time) time = Date.now()

        var msPerMinute = 60 * 1000;
        var msPerHour   = msPerMinute * 60;
        var msPerDay    = msPerHour * 24;
        
        var elapsed = Date.now() - time;
        
        if (elapsed < msPerMinute) return `${this.uts(Math.round(elapsed / 1000), ' second', ' seconds', ' seconds')} ago`;
            else if (elapsed < msPerHour) return `${this.uts(Math.round(elapsed / msPerMinute), ' minute', ' minutes', ' minutes')} ago`;
                else if (elapsed < msPerDay) return `${this.uts(Math.round(elapsed / msPerHour), ' hour', ' hours', ' hours')} ago`;
                    else {
                        let { day, month_name, year } = this.unix(time)
                        return `${day} ${month_name} ${year}`
                    }
    },
    unix(unix = Date.now()) {
        const Months_name = [ "january", "february", "martha", "april", "may", "june", "july", "august", "september", "october", "november", "december" ];
    
        let date = new Date(unix),
            year = date.getFullYear(),
            day = date.getDate(),
            month = date.getMonth(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
    
        if (month < 10) month = `0${ month }`;
        if (day < 10) day = `0${ day }`;
        if (hours < 10) hours = `0${ hours }`;
        if (hours >= 24) hours = `0${ hours - new Number(24) }`;
        if (minutes < 10) minutes = `0${ minutes }`;
        if (minutes >= 60) minutes = `0${ minutes - new Number(60) }`;
        if (seconds < 10) seconds = `0${ seconds }`;
        if (seconds >= 60) seconds = `0${ seconds - new Number(60) }`;
    
    
        return {
            year      : year,
            day       : day,
            month     : month,
            month_name: Months_name[Number(month)],
            hours     : hours,
            minutes   : minutes,
            seconds   : seconds
        }
    }
}