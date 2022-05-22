const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'songs' });

        this.router = this.express.Router();

        this.routers();
    }

    routers() {

        console.log(1);

        this.router.post('/top/:type(tracks|artists)/:userId', async (req, res) => {
            let { type, userId } = req.params;
            res.send(await this.spotify.getTopItems(userId, type))
        });

        this.router.post('/history/:userId', async (req, res) => {
            let { userId } = req.params;
            res.send(await this.spotify.getHistory(userId))
        });

        this.router.post('/playlists/:userId', async (req, res) => {
            let { userId } = req.params;
            res.send(await this.spotify.getPlaylists(userId))
        });

    }
}