const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'images' });

        this.router = this.express.Router();

        this.routers();
    }

    routers() {
        this.router.post('/upload', this.upload.single('file'), async (req, res) => {
            let { token } = req.query,
                { file } = req;
            if (!file) return res.send({ message: 'No image :(' });
            try {
                await this.db.authClient(token);
                let { imageId, type, message } = await this.db.uploadImage(req.file);
                if (message) return res.send({ message });
                res.send({ status: 200, imageId, type });
            } catch (err) {
                console.log(err);
                return res.send({ status: 401, message: 'Your token is invalid :O' });
            }
        });

        this.router.get('/:imageId', async (req, res) => {
            let { token, type } = req.query,
                { imageId } = req.params;
            if (type === 'json') {
                try {
                    await this.db.authClient(token);
                    res.send({ status: 200 });
                } catch (err) {
                    return res.send({ status: 404 });
                }
            } else {
                let path = this.path.join(__dirname, `../images`);
                this.fs.readdir(path, (err, files) => {
                    const image = files.find(item => (item.split('.')[0] === imageId) || item === imageId);
                    res.sendFile(`${path}/${image}`);
                });
            }
        });

        this.router.post('/:imageId/delete', async (req, res) => {
            let { token } = req.query,
                { imageId } = req.params;
            try {
                await this.db.authClient(token, 'w');
                let images = this.fs.readdirSync('./images', { encoding: 'utf-8' }),
                    image = images.find(item => item.includes(imageId));
                if (!image) return res.send({ status: 404 });
                this.fs.unlinkSync(`./images/${image}`);
                res.send({ status: 200 });
            } catch (err) {
                return res.send({ status: 401, message: 'Your token is invalid :O' });
            }
        });
    }
}