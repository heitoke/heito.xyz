export interface IRole {
    name: string;
    match: RegExp;
    result(text: string, self: any, _this: any): string;
}

export interface ISave {
    [key: string]: string;
}

class Markdown {
    readonly text: string;
    private save: ISave;
    private replacedList: object;
    private roles: IRole[];

    constructor(text: string) {
        this.text = text;
        this.save = {};
        this.replacedList = {};
        this.roles = [
            // * Codeblock
            {
                name: 'code',
                match: /`{3}([a-z]*\n[\s\S]*?\n)`{3}/gm,
                result(text, self, _this) {
                    return text.replace(self.match, (t, a) => {
                        let id = _this.createId(a);
                        return `<code><pre><!--${id}--!></pre></code>`;
                    });
                }
            },
            // * Blockquote
            {
                name: 'blockquote',
                match: /^((&gt;|\s+&gt;){1,999} (.*))+/gm,
                result(text, self) {
                    let matches = text.match(self.match),
                        setValue = (val: string) => `<blockquote>\n${val}</blockquote>`;
                    if (matches) for (let match of matches) {
                        // console.log(match);
                        let value = match.replace(/\n/, '').replace(/\n/gm, '<br>\n').replace(/&gt; |&gt;/g, '');
                        text = text.replace(match, setValue(value));
                    }
                    return text;
                }
            },
            // * Headers
            {
                name: 'headers',
                match: /(^#{1,6})(\s)(.*)/gmi,
                result(text, self, _this) {
                    return text.replace(self.match, (t: string) => {
                        let tt = t.split(' ');
                        if (!_this.replacedList?.headers) _this.replacedList['headers'] = [];
                        let value = tt.slice(1).join(' '),
                            id = value.toLowerCase().replace(/ /g, '-'),
                            isId = _this.replacedList['headers']?.filter((item: any) => item.id === id);
                        _this.replacedList['headers'] = [..._this.replacedList['headers'], {
                            id: isId?.length > 0 ? `${id}-${isId.length}` : id,
                            value,
                            type: tt[0].length,
                        }];
                        return `<h${tt[0].length} id="${id}">${tt.slice(1).join(' ')}</h${tt[0].length}>`;
                    });
                }
            },
            // * Checkbox
            {
                name: 'checkbox',
                match: /\[\s\]/g,
                result(text, self) {
                    return text.replace(self.match, `<input type="checkbox" disabled>`);
                }
            },
            // * Checkbox Checked
            {
                name: 'checkbox-checked',
                match: /\[x\]/g,
                result(text, self) {
                    return text.replace(self.match, `<input type="checkbox" checked disabled>`);
                }
            },
            // * Bold
            {
                name: 'bold',
                match: /(?<!\*|\\\*)\*{2,2}(.+?)\*{2,2}(?!\*|\\)|(?<!_|_)_{2,2}(.+?)_{2,2}(?!_|\\)/gm,
                result(text, self) {
                    return text.replace(self.match, `<strong>$1$2</strong>`);
                }
            },
            // * Italic
            {
                name: 'italic',
                match: /(?<!\*|\\\*)\*{1,1}(.+?)\*{1,1}(?!\*|\\)|(?<!_|_)_{1,1}(.+?)_{1,1}(?!_|\\)/gmi,
                result(text, self) {
                    return text.replace(self.match, `<em>$1$2</em>`);
                }
            },
            // * Image
            {
                name: 'image',
                match: /!\[(.*?)\]\((.*?)\)/g,
                result(text, self) {
                    return text.replace(self.match, `<div><img src="$2" alt="$1"></div>`);
                }
            },
            // * Link
            {
                name: 'link',
                match: /\[(.*)\]\((.*?)\)/g,
                result(text, self) {
                    return text.replace(self.match, `<a href="$2" class="link" target="_blank">$1</a>`);
                }
            },
            // * Monospace
            {
                name: 'monospace',
                match: /`([^`]*)`/g,
                result(text, self) {
                    return text.replace(self.match, `<span class="monospace">$1</span>`);
                }
            },
            // * Error
            {
                name: 'error',
                match: /^!{3}\s(.*)/gm,
                result(text, self) {
                    return text.replace(self.match, `<div class="error">$1</div>`);
                }
            },
            // * Warning
            {
                name: 'warning',
                match: /^!{2}\s(.*)/gm,
                result(text, self) {
                    return text.replace(self.match, `<div class="warning">$1</div>`);
                }
            },
            // * Background color
            {
                name: 'bg-color',
                match: /\.\s{#([A-Fa-f0-9]{6})}\s(.*)/gm,
                result(text, self, _this) {
                    return text.replace(self.match, (t, bgColor, text) => {
                        return `<div class="bg-color" style="background-color: #${bgColor}; color: ${_this.getAltColor(bgColor)};">${text}</div>`;
                    });
                } 
            },
            // * Table
            {
                name: 'table',
                match: /\|(?:[^\r\n|]*\|)+\r?\n(\|?( )??(:| |: )?-+?(:| | :)??( )?\|)+\r?\n(\|(?:[^\r\n|]*\|)+\r?\n)+/g,
                result(text, self) {
                    return text.replace(self.match, t => {
                        let tt = t.split('\n'),
                            r = (t: string) => t.split('|').filter(item => item !== ''),
                            header = tt[0].split('|').filter(item => item !== ''),
                            width = tt[1].split('|').filter(item => item !== ''),
                            rows = tt.slice(2).map((col: string) => r(col));

                    return `
<table>
<thead>
    <tr>
    ${header.slice(0, width.length).map(item => `<th scope="col">${item}</th>`).join('')}
    </tr>
</thead>
${rows.map(row => `<tr>${row.slice(0, width.length).map((col, idx) => {
    let align = width[idx].replace(/-/g, '');
    return `<td style="text-align: ${(align[0] === ' ' && align[1] === ' ') || (align[0] === ':' && align[1] === ' ') ? 'left' : (align[0] === ':' && align[1] === ':' ? 'center' : 'right')};">${col}</td>`;
}).join('')}</tr>`).join('')}
</table>`
                    });
                }
            },
            // * List (ul) [*]
            {
                name: 'list',
                match: /(\n(([*+-]|) ).*)+/gm,
                result(text, self, _this) {
                    let matches = text.match(self.match);
                    if (matches) for (let match of matches) {
                        let _match = match.split('\n').filter(e => e !== '').map(e => `\n${e}`),
                            rege = new RegExp(_match.map(item => item.replace(/\*/g, '\\*').replace(/\+/g, '\\+')).join(''), 'gm');
                        text = text.replace(rege, _this.createList(_match));
                    }
                    return text;
                }
            },
            // * List (ol) [1.]
            {
                name: 'list-numbers',
                match: /(\n([0-9]+\.|) (.*))+/gm,
                result(text, self, _this) {
                    let matches = text.match(self.match);
                    if (matches) for (let match of matches) {
                        let _match = match.split('\n').filter(e => e !== '').map(e => `\n${e}`),
                            rege = new RegExp(_match.join(''), 'gm');
                        text = text.replace(rege, _this.createList(_match.map(item => item.replace(/\d. /g, '')), 'ol'));
                    }
                    return text;
                }
            },
            // * Text
            {
                name: 'text',
                match: /([^\n]+\n?)/g,
                result(text, self) {
                    return text.replace(self.match, `<p>$1</p>`)
                }
            }
        ];
    }

    createId(text: string): number {
        let id = Math.floor(Math.random() * 1000000000000000) + 0;
        if (this.save[id]) return this.createId(text);
        this.save[id] = text;
        return id;
    }

    createList(content: string[], type: 'ul' | 'ol' = 'ul', name: string = 'list') {
        content = content?.map(item => item.replace(/\s\s\s\s/g, `\t`).replace(/\n/g, ''));
        let result = ``, next = 0;
        console.log(content);
        
        content.map((item, i) => {
            let c = (e: string) => e?.split('\t').filter(e => e === '').length,
                n = content[i + 1], p = content[i - 1],
                s = (e: string) => e?.replace(/((\t)+[*+-] )|([*+-] )/g, ``);
    
            if (c(item) < c(n)) {
                next++;
                return result += `<li>${s(item)}<${type}>`;
            }
            else if (c(item) > c(p)) return result += `<li>${s(item)}</li>`
            else if (c(item) === 0 && c(p) > 0) {
                result += `${`</${type}>`.repeat(next)}<li>${s(item)}</li>`;
                return next = 0;
            }
            else return result += `<li>${s(item)}</li>`;
        })
        return `<${type} class="${name}">${result}</${type}>`;
    }

    getAltColor(color: string) {
        if (color[0] === '#') color = color.substring(1);
        let rgb = parseInt(color, 16),
            r = (rgb >> 16) & 0xff,
            g = (rgb >>  8) & 0xff,
            b = (rgb >>  0) & 0xff,
            luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return `#${luma < 40 ? 'ffffff' : '000000'}`;
    }

    init() {
        let text = this.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        for (let { name, result } of this.roles)
            text = result(text, this.roles.find(e => e.name === name), this);
        for (let id in this.save) {
            text = text.replace(new RegExp(`<!--${id}--!>`, 'g'), this.save[id]);
        }
        this.save = {};
        return text;
    }
}

export default Markdown;