export interface INameIcon {
    name: string,
    icon: string
}

export interface INameIconRegex extends INameIcon {
    regex: RegExp;
}

class Device {
    private userAgent: string = '';

    private readonly listOS: Array<INameIconRegex> = [
        { name: 'Android', icon: 'android', regex: /Android/i },
        { name: 'iPhone', icon: 'appleinc', regex: /iPhone/i },
        { name: 'iPad', icon: '', regex: /iPad/i },
        { name: 'iPod', icon: '', regex: /iPod/i },
        { name: 'Symbian', icon: '', regex: /Symbian/i },
        { name: 'Windows Phone', icon: 'windows8', regex: /Windows Phone/i },
        { name: 'Tablet OS', icon: '', regex: /Tablet OS/i },
        { name: 'Linux', icon: 'linux', regex: /Linux/i },
        { name: 'Windows', icon: 'windows', regex: /Windows NTi/ },
        { name: 'Macintosh', icon: '', regex: /Macintosh/i },
        { name: 'cURL', icon: '', regex: /curl/i },
        { name: 'Postman', icon: '', regex: /Postman/i },
        { name: 'WebOS', icon: '', regex: /webOS/i }
    ];

    private readonly listBrowsers: Array<INameIconRegex> = [
        { name: 'Chrome', icon: '', regex: /Chrome/i },
        { name: 'Internet Explorer', icon: '', regex: /MSIE/i },
        { name: 'Firefox', icon: 'firefox', regex: /Firefox/i },
        { name: 'Safari', icon: 'safari', regex: /Safari/i },
        { name: 'Opera', icon: 'opera', regex: /OP/i },
    ];

    public os: INameIcon = { name: '', icon: '' };
    public browser: INameIcon = { name: '', icon: '' };

    constructor() {}

    setUserAgent(userAgent: string) {
        this.userAgent = userAgent;

        this.setOS();
        this.setBrowser();

        return this;
    }

    private setOS() {
        const os = this.listOS.find(os => os.regex.test(this.userAgent));

        this.os = {
            name: os?.name || '',
            icon: os?.icon || ''
        }
    }

    private setBrowser() {
        const browser = this.listBrowsers.find(os => os.regex.test(this.userAgent));

        this.browser = {
            name: browser?.name || '',
            icon: browser?.icon || ''
        }
    }
}

export const device = new Device();