const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'services' });

        this.router = this.express.Router();

        this.cache = {}

        this.spotifyUserTokens = {};

        this.routers();
    }

    async getAccount(type, key) {
        let data;
        if (!this.cache[type]) this.cache[type] = {}
        switch(type) {
            case "spotify":
                if (!this.envs.SPOTIFY_ID || !this.envs.SPOTIFY_SECRET) return;
                if (!this.cache.spotify[key] || this.getHours(this.cache.spotify[key]?.date) >= 1 || this.cache.spotify[key]?.error) {
                    this.spotifyAccount(this.spotifyUserTokens[key]?.token);
                }
                break;
            case "github":
                if (!this.cache.github[key] || this.getHours(this.cache.github[key]?.date) >= 1 || this.cache.github[key]?.error) {
                    try {
                        let { data } = await this.axios.get(`https://api.github.com/users/${key}`);
                        this.cache.github[key] = { last: Date.now(), data }
                    } catch (error) {
                        this.cache.github[key] = { last: Date.now(), data: error.response.data, error: true }   
                    }
                }
                break;
            case "telegram":
                if (!this.envs.TELEGRAM_TOKEN) return;
                if (!this.cache.telegram[key] || this.getHours(this.cache.telegram[key]?.date) >= 1 || this.cache.telegram[key]?.error) {
                    await this.telegramAccount(key);
                }
                break;
            case "discord":
                if (!this.cache.discord[key] || this.getHours(this.cache.discord[key]?.date) >= 1 || this.cache.discord[key]?.error) {
                    try {
                        let { data } = await this.axios.get(`https://japi.rest/discord/v1/user/${key}`);
                        this.cache.discord[key] = { last: Date.now(), data: {
                            ...data.data,
                            connections: data.connections,
                            presence: data.presence
                        } }
                    } catch (error) {
                        this.cache.discord[key] = { last: Date.now(), data: error.response.data, error: true }   
                    }
                }
                break;
            case "steam":
                if (!this.envs.STEAM_KEY) return;
                try {
                    let { data } = await this.axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.envs.STEAM_KEY}&steamids=${key}`);
                    this.cache.steam[key] = { last: Date.now(), data: data.response.players[0] }
                } catch (error) {
                    this.cache.steam[key] = { last: Date.now(), data: error.response.data, error: true }   
                }
                break;
            case "osu":
                if (!this.envs.OSU_TOKEN) return;
                if (!this.cache.osu[key] || this.getHours(this.cache.osu[key]?.date) >= 1 || this.cache.osu[key]?.error) {
                    try {
                        let data = await this.getUserOSU(key);
                        this.cache.osu[key] = { last: Date.now(), data: { ...data,
                            url: `https://osu.ppy.sh/users/${data.user_id}`,
                            avatar: `https://a.ppy.sh/${data.user_id}`
                        } }
                    } catch (error) {
                        this.cache.osu[key] = { last: Date.now(), data: error?.response?.data, error: true }   
                    }
                }
                break;
            case "minecraft":
                if (!this.cache.minecraft[key] || this.getHours(this.cache.minecraft[key]?.date) >= 1 || this.cache.minecraft[key]?.error) {
                    try {
                        let { data } = await this.axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${key}`);
                        this.cache.minecraft[key] = { last: Date.now(), data: {
                            username: data.name,
                            avatar: `https://crafatar.com/avatars/${key}?overlay=true`,
                            url: `https://ru.namemc.com/profile/${data.name}`
                        } }
                    } catch (error) {
                        this.cache.minecraft[key] = { last: Date.now(), data: error?.response?.data, error: true }   
                    }
                }
                break;
            case "email":
                this.cache.email[key] = { data: { username: key } }
                break;
            default:
                return { status: 404 }
                break;
        }
    }

    async getActivity(type, key) {
        let data;
        switch(type) {
            case "spotify":
                if (!this.envs.SPOTIFY_ID || !this.envs.SPOTIFY_SECRET) return;
                try {
                    let { data } = await this.axios.get(`https://api.spotify.com/v1/me/player`, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${this.spotifyUserTokens[key]?.token}`
                        }
                    });
                    if (!data?.is_playing) return { activity: false }
                    return {
                        name: data.item.name,
                        state: data.item.artists.map(x => x.name).join(', '),
                        largeImage: {
                            value: data.item.album.images[0].url
                        },
                        bar: {
                            min: this.msInMin(data.progress_ms),
                            value: Math.floor(100 * (data.progress_ms / data.item.duration_ms)),
                            max: this.msInMin(data.item.duration_ms),
                            color: '#1DB954',
                        },
                        buttons: [
                            { label: 'Open a song', icon: 'uil uil-music-note', url: data.item.external_urls.spotify, }
                        ]
                    }
                } catch (err) {
                    console.log(err);
                    return { error: true }
                }
                break;
            case "steam":
                if (!this.envs.STEAM_KEY) return;
                try {
                    let { data } = await this.axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.envs.STEAM_KEY}&steamids=${key}`);
                    data = data.response.players[0];
                    if (!data?.gameid) return { activity: false }
                    return {
                        name: data.gameextrainfo,
                        largeImage: {
                            value: `https://cdn.cloudflare.steamstatic.com/steam/apps/${data.gameid}/header.jpg`
                        },
                        buttons: [
                            { label: 'Open in Steam', icon: 'uil uil-shopping-bag', url: `https://store.steampowered.com/app/${data.gameid}` },
                            { label: 'Run', icon: 'uil uil-play', url: `steam://run/${data.gameid}` }
                        ],
                        type: 'mini'
                    }
                } catch (err) {
                    console.log(err);
                    return { error: true }
                }
                break;
            case "osu":
                try {
                    let { level, pp_raw, pp_rank, pp_country_rank } = await this.getUserOSU(key),
                        levelBar = Math.floor((Number(level) - Math.floor(level)) * 100);
                    return {
                        state: `pp: <b>${Math.floor(pp_raw)}</b><br>Ретинг: <b><span ui-title="По миру" uit-bottom>${pp_rank}</span><span ui-title="По стране" uit-bottom> [${pp_country_rank}]</span></b><br>Level: <b>${Math.floor(level)}</b>`,
                        bar: {
                            min: Math.floor(level),
                            value: levelBar,
                            max: Math.floor(level) + 1
                        }
                    }
                } catch (err) {
                    console.log(err);
                    return { error: true }
                }
                break;
            default:
                return { activity: false }
                break;
        }
    }

    async spotifyAccount(token) {
        try {
            let { data } = await this.axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            this.cache.spotify[data.id] = { last: Date.now(), data }
            return this.cache.spotify[data.id].data;
        } catch (err) {
            console.log(err);
        }
    }

    async refreshSpotify(token) {
        try {
            let { data } = await this.axios({
                url: `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${token}`,
                headers: { 
                    'Authorization': `Basic ${new Buffer(`${this.envs.SPOTIFY_ID}:${this.envs.SPOTIFY_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST'
            }),
                user = await this.spotifyAccount(data.access_token);

            this.spotifyUserTokens[token] = this.spotifyUserTokens[user.id] = { date: Date.now(), userId: user.id, token: data.access_token };

            return user.id;
        } catch (err) {

        }
    }

    async telegramAccount(userId) {
        let url = file => `https://api.telegram.org/${file ? 'file/' : ''}bot${this.envs.TELEGRAM_TOKEN}`;
        try {
            let user = await (await this.axios.get(`${url()}/getChat?chat_id=${userId}`)).data.result,
                photos = await (await this.axios.get(`${url()}/getUserProfilePhotos?user_id=${user.id}`)).data.result,
                file = await (await this.axios.get(`${url()}/getFile?file_id=${photos.photos[0][2].file_id}`)).data.result;
            await (await this.axios.get(`${url(true)}/${file.file_path}`, {
                responseType: 'stream'
            })).data.pipe(this.fs.createWriteStream(`./images/${user.id}.jpg`));
            this.cache.telegram[user.id] = { last: Date.now(), data: { ...user, avatar: `${user.id}.jpg` } }
        } catch (error) {
            console.log(error);
            this.cache.telegram[userId] = { last: Date.now(), data: error.response.data, error: true }   
        }
    }

    async getUserOSU(username) {
        if (!this.envs.OSU_TOKEN) return;
        let { data } = await this.axios.get(`https://osu.ppy.sh/api/get_user?k=${this.envs.OSU_TOKEN}&u=${username}`);
        return data[0];
    }

    routers() {

        this.router.post('/', async (req, res) => {
            let { token } = req.query,
                list = this.db.get('services').list;
            try {
                if (!this.db.authClient(token)) {
                    for (let item of list.filter(item => item.isActive)) {
                        if (item.type === 'spotify' && (!this.spotifyUserTokens[item.key] || this.getHours(this.spotifyUserTokens[item.key]?.date) >= 1)) {
                            item.key = await this.refreshSpotify(item.key);
                        } else if (item.type === 'spotify' && this.spotifyUserTokens[item.key]) item.key = this.spotifyUserTokens[item.key].userId;
                    }
                    res.send(list.filter(item => item.isActive));
                } else res.send(list);
            } catch (err) {
                console.log(err);
            }
        });

        this.router.post('/update', async (req, res) => {
            let { token, data } = req.body;
            try {
                if (!this.db.authClient(token)) return res.send({ status: 401 });
                let list = this.db.get('services').list;
                list = data;
                this.db.updateFile('services', list);
                res.send({ status: 200 });
            } catch (err) {
                console.log(err);
            }
        });

        this.router.post('/account/:type/:key', async (req, res) => {
            let { type, key } = req.params;
            if (!type || !key) return res.send({ message: ':(' });
            try {
                await this.getAccount(type, key);
                let typeService = this.cache[type][key];
                res.send(typeService ? typeService?.data : { status: 404 });
            } catch (err) {
                console.log(err);
            }
        });

        this.router.post('/activity/:type/:key', async (req, res) => {
            let { type, key } = req.params;
            if (!type || !key) return res.send({ message: ':(' });
            try {
                res.send(await this.getActivity(type, key) || { status: 404 });
            } catch (err) {
                console.log(err);
            }
        });
    }
}