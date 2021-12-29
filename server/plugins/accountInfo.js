const
    axios = require('axios').default,
    speakeasy = require('speakeasy'),
    { accounts, Authenticator, spotify, steam, OSU } = require('../accounts.js'),
    SpotifyWebApi = require('spotify-web-api-node'),
    osu = require('node-osu');

module.exports = class AccountInfo {
    constructor() {

        this.spotifyApi = new SpotifyWebApi({
            clientId: spotify.id,
            clientSecret: spotify.secret,
            redirectUri: `http://localhost:1000/spotify/callback`
        });

        this.osuApi = new osu.Api(OSU.token, { notFoundAsError: true, completeScores: false, parseNumeric: false });
        
        this.speakeasy = speakeasy;

        this.time = null;
        this.intervals = {};


        this.catchAccounts = [];
        this.catchActivity = null;
    }

    getHours(time) {
        return new Date(Date.now() - time).getUTCHours();
    }

    getMinutes(time) {
        return new Date(Date.now() - time).getUTCMinutes();
    }

    getSeconds(time) {
        return new Date(Date.now() - time).getUTCSeconds();
    }

    async getTokenSpotify(refresh) {
        this.spotifyApi.setRefreshToken(refresh);
    
        try {
            const { body } = await this.spotifyApi.refreshAccessToken()
            // spotify.tokens = { access: body.access_token, refresh }
            this.spotifyApi.setAccessToken(body.access_token);
            setInterval(() => this.getTokenSpotify(), (body.expires_in * 1000) - 50000)
            return body;
        } catch (err) {
            return err;
        }
    }

    async getAccountInfo() {
        let data;

        if (this.time !== null || this.getHours(this.time) < 1) return this.catchAccounts;

        this.catchAccounts = [];
        this.time = Date.now();

        for (let { type, params } of accounts.filter(item => !item?.off)) {
            switch(type) {
                case "spotify":
                    await this.getTokenSpotify(params.refresh);
                    let { body } = await this.spotifyApi.getMe();
                    this.catchAccounts = [ ...this.catchAccounts, { 
                        type, data: { username: body.display_name, id: body.id, url: body.external_urls.spotify, avatar: body.images[0].url }
                    } ];
                    break;
                case "steam":
                    data = await (await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam.key}&steamids=${params.id}`)).data;
                    data = data.response.players.find(item => item.steamid === params.id);
                    this.catchAccounts = [ ...this.catchAccounts, {
                        type, data: { username: data.personaname, id: params.id, url: data.profileurl, avatar: data.avatarfull }
                    } ];
                    break;
                case "github":
                    data = await (await axios.get(`https://api.github.com/users/${params.login}`)).data;
                    this.catchAccounts = [ ...this.catchAccounts, {
                        type, data: { username: data.login, id: data.id, url: data.html_url, avatar: data.avatar_url }
                    } ];
                    break;
                case "osu":
                    let user = await this.osuApi.getUser({ u: params.u });
                    this.catchAccounts = [ ...this.catchAccounts, {
                        type, data: { username: user.name, id: user.id, url: `https://osu.ppy.sh/users/${user.id}`, avatar: `https://a.ppy.sh/${user.id}` }
                    } ];
                    break;
                case "minecraft":
                    data = await (await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${params.uuid}`)).data
                    this.catchAccounts = [ ...this.catchAccounts, {
                        type, data: { username: data.name, url: `https://ru.namemc.com/profile/${data.name}`, avatar: `https://crafatar.com/avatars/${params.uuid}?overlay=true` }
                    } ];
                    break;
            }
        }
    
        return this.catchAccounts;
    }

    async getAccountActivity() {
        if (this.catchActivity === null) this.catchActivity = [];

        for (let i = 0; i < accounts.length; i++) {
            let { type, params, interval } = accounts[i];
            let account = this.catchActivity.find((item, idx) => item.type === type && idx === i),
                activity = this[`${type}Activity`] ? this[`${type}Activity`](params) : false;

            if (activity) {
                if (interval) {
                    if (this.intervals[type] && this.getSeconds(this.intervals[type]) < interval) {
                        null
                    } else {
                        this.intervals[type] = Date.now();
                        account ? account = await activity : this.catchActivity = [ ...this.catchActivity, await activity ];
                    }
                } else account ? account = await activity : this.catchActivity = [ ...this.catchActivity, await activity ];
            }
        }

        return this.catchActivity;
    }

    async spotifyActivity({ refresh }) {
        // if (this.getHours(this.time) > 0) await this.getTokenSpotify(refresh);
        const { body: { id } } = await this.spotifyApi.getMe();
        const { body } = await this.spotifyApi.getMyCurrentPlaybackState();
        let device = {
            Smartphone: 'uil uil-mobile-android',
            Computer: 'uil uil-desktop',
            TV: 'uil uil-tv-retro'
        }
        return {
            type: 'spotify', id,
            data: body.is_playing ? {
                action: 'Слушает',
                name: body.item.name,
                state: body.item.artists.map(x => x.name).join(', '),
                images: {
                    big: body.item.album.images[0].url,
                    icon: device[body.device.type]
                },
                buttons: [
                    { label: 'Открыть песню', url: body.item.external_urls.spotify, icon: 'uil uil-music-note' }
                ]
            } : false
        }
    }
    
    async githubActivity({ login }) {
        console.log(1);
        let { data } = await axios(`https://api.github.com/users/${login}`);
        return {
            type: 'github',
            id: data.id,
            data: {
                action: 'Информация',
                state: `Репозиториев: <b>${data.public_repos}</b><br>Обновление раз в час`
            }
        }
    }
    
    async steamActivity({ id }) {
        let { data } = await axios(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam.key}&steamids=${id}`);
        let user = data.response.players[0];
        return {
            type: 'steam', id,
            data: user.gameid ? {
                mode: 'mini',
                action: 'Играет в',
                name: user.gameextrainfo,
                images: {
                    big: `https://cdn.cloudflare.steamstatic.com/steam/apps/${user.gameid}/header.jpg`
                },
                banner: `https://cdn.cloudflare.steamstatic.com/steam/apps/${user.gameid}/header.jpg`,
                buttons: [
                    { label: 'Открыть в Steam', url: `https://store.steampowered.com/app/${user.gameid}`, icon: 'uil uil-shopping-bag' },
                    { label: 'Запустить', url: `steam://run/${user.gameid}`, icon: 'uil uil-play' }
                ]
            } : false
        }
    }
    
    async osuActivity({ u }) {
        let user = await this.osuApi.getUser({ u });
        let levelBar = Math.floor((Number(user.level) - Math.floor(user.level)) * 100)
        return {
            type: 'osu',
            id: user.id,
            data: {
                action: 'Информация',
                state: `pp: <b>${Math.floor(user.pp.raw)}</b><br>Ретинг: <b><span ui-title="По миру" uit-bottom>${user.pp.rank}</span><span ui-title="По стране" uit-bottom> [${user.pp.countryRank}]</span></b><br><b>Уровень</b><br><div class="bar"><div class="line"><div style="width: ${levelBar}%;"></div></div><div class="text"><span>${Math.floor(user.level)}</span><span>${levelBar}%</span><span>${Math.floor(user.level) + 1}</span></div></div>`
            }
        }
    }

    getAuth(token) {
        return this.speakeasy.totp.verify({ ...Authenticator, token });
    }
}