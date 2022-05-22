const fs = require('fs');

module.exports = class FileSystem {
    constructor() {}

    generate = (length = 32) => new Array(length).fill(`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`).map(x => x[Math.floor(Math.random() * x.length)]).join('');


    path(name) {
        return `./json/${name}.json`;
    }

    get(name) {
        let list = JSON.parse(fs.readFileSync(this.path(name), { encoding: 'utf-8' })),
            self = this;
        return {
            list,
            add(data) {
                let id = self.generate(24);
                if (list.find(item => item.id === id)) return this.add(data);
                list = [ ...list, { id, ...data } ];
                fs.writeFileSync(self.path(name), JSON.stringify(list), { encoding: 'utf-8' });
                return { status: 200 };
            },
            update(id, data) {
                let block = list.find(item => item.id === id);
                if (!block) return { status: 404 };
                list[list.findIndex(item => item.id === block.id)] = { id: block.id, ...data };
                fs.writeFileSync(self.path(name), JSON.stringify(list), { encoding: 'utf-8' });
                return { status: 200 };
            },
            remove(id) {
                list = list.filter(item => item.id !== id);
                fs.writeFileSync(self.path(name), JSON.stringify(list), { encoding: 'utf-8' });
                return { status: 200 };
            }
        }
    }

    updateFile(name, data) {
        fs.writeFileSync(this.path(name), JSON.stringify(data), { encoding: 'utf-8' });
    }

    authClient(token) {
        return this.get('users').list.find(item => item.token === `${token}`);
    }

    /**
     * 
     * @param { Object | String } image
     * @param { "file" | "url" } type
     * 
    */
    uploadImage(image, type = 'file', imageId = this.generate(24)) {
        let types = {
            'image/gif': 'gif',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/svg+xml': 'svg'
        }[image.mimetype];

        if (!types) return { message: 'The file type does not fit :)' };

        fs.writeFileSync(`./images/${imageId}.${types}`, image.buffer, { encoding: 'binary' });

        return { imageId, type: types };
    }
}