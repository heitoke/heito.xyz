const
    axios = require('axios').default,
    speakeasy = require('speakeasy'),
    { Authenticator, spotify, steam, OSU } = require('../json/config.json'),
    accounts = require('../json/accounts.json')
    fs = require('fs');

module.exports = class AccountInfo {
    constructor() {
        this.spotifyToken = null;
        
        this.speakeasy = speakeasy;

        this.time = null;
        this.intervals = {};

        this.catchAccounts = [];
        this.catchActivity = null;
    }

    // ? Get Time

    getHours(time) {
        return new Date(Date.now() - time).getUTCHours();
    }

    getMinutes(time) {
        return new Date(Date.now() - time).getUTCMinutes();
    }

    getSeconds(time) {
        return new Date(Date.now() - time).getUTCSeconds();
    }

    // ? Get and Update Config

    getConfig() {
        return JSON.parse(fs.readFileSync(`${__dirname}/json/config.json`, { encoding: 'utf-8' }));
    }

    updateConfig(data) {
        fs.writeFile(`${__dirname}/json/config.json`, JSON.stringify(data), { encoding: 'utf-8' });
    }

    // ? Get and Update Accounts

    getAccounts() {
        return JSON.parse(fs.readFileSync(`${__dirname}/json/accounts.json`, { encoding: 'utf-8' }));
    }

    updateAccounts(data) {
        fs.writeFile(`${__dirname}/json/accounts.json`, JSON.stringify(data), { encoding: 'utf-8' });
    }

    // ? Get Accounts

    async getAccountInfo() {
        let data;

        if (this.time !== null || this.getHours(this.time) < 1) return this.catchAccounts;

        this.catchAccounts = [];
        this.time = Date.now();

        for (let { type, params } of accounts.filter(item => !item?.off)) {
            switch(type) {
                case "spotify":
                    let { display_name, id, external_urls, images } = await this.getSpotifyRequest(params.refresh)
                    this.catchAccounts = [ ...this.catchAccounts, { 
                        type, data: { username: display_name, id, url: external_urls.spotify, avatar: images[0].url }
                    } ];
                    break;
                case "discord":
                    data = await (await axios.get(`https://japi.rest/discord/v1/user/${params.id}`)).data.data;
                    this.catchAccounts = [ ...this.catchAccounts, {
                        type, data: { username: data.tag, id: data.id, url: `https://discord.com/users/${data.id}`, avatar: data.avatarURL }
                    } ];
                    break;
                case "steam":
                    data = await (await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam.key}&steamids=${params.id}`)).data;
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
                    let { username, user_id } = await this.getUserOSU(params.u);
                    this.catchAccounts = [ ...this.catchAccounts, {
                        type, data: { username, id: user_id, url: `https://osu.ppy.sh/users/${user_id}`, avatar: `https://a.ppy.sh/${user_id}` }
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

    // ? Get Activity Accounts

    async getAccountActivity() {
        this.catchActivity = [];

        for (let _account of accounts) {
            let { type, params, interval, off } = _account,
                activity = this[`${type}Activity`] || false;

            if (activity) {
                let a;
                switch(type) {
                    case "spotify": a = await this.spotifyActivity(params); break;
                    case "steam": a = await this.steamActivity(params); break;
                    case "osu": a = await this.osuActivity(params); break;
                }
                if (interval) {
                    if (this.intervals[type] && this.getSeconds(this.intervals[type]) < interval) {
                        null
                    } else {
                        this.intervals[type] = Date.now();
                        this.catchActivity = [ ...this.catchActivity, a ];
                    }
                } else this.catchActivity = [ ...this.catchActivity, a ];
            }
        }

        return this.catchActivity;
    }

    // ? Spotify

    async getTokenSpotify(refresh) {
        try {
            let { data } = await axios({
                url: `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refresh}`,
                headers: { 
                    'Authorization': `Basic ${new Buffer(`${spotify.id}:${spotify.secret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST'
            });
            this.spotifyToken = data.access_token;
        } catch (err) {
            console.log(err);
        }
    }

    async getSpotifyRequest(refresh, path = '') {
        if (!this.spotifyToken || !this.time || this.getHours(this.time) > 0) await this.getTokenSpotify(refresh);
        try {
            let { data } = await axios({
                url: `https://api.spotify.com/v1/me${path}`,
                headers: { 'Authorization': `Bearer ${this.spotifyToken}` },
                method: 'GET'
            });
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    async spotifyActivity({ refresh }) {
        if (!this.spotifyToken || !this.time || this.getHours(this.time) > 0) await this.getTokenSpotify(refresh);
        const { id } = await this.getSpotifyRequest(refresh);
        const body = await this.getSpotifyRequest(refresh, '/player');
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

    // ? GitHub
    
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

    // ? Steam
    
    async steamActivity({ id }) {
        let { data } = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam.key}&steamids=${id}`);
        let user = data.response.players[0];
        return {
            type: 'steam', id,
            data: user?.gameid ? {
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
    
    // ? OSU

    async getUserOSU(username) {
        let { data } = await axios.get(`https://osu.ppy.sh/api/get_user?k=${OSU.token}&u=${username}`);
        console.log(data[0].user_id);
        return data[0];
    }

    async osuActivity({ u }) {
        let { user_id, level, pp_raw, pp_rank, pp_country_rank } = await this.getUserOSU(u),
            levelBar = Math.floor((Number(level) - Math.floor(level)) * 100);
            console.log(user_id, u);
        return {
            type: 'osu',
            id: user_id,
            data: {
                action: 'Информация',
                state: `pp: <b>${Math.floor(pp_raw)}</b><br>Ретинг: <b><span ui-title="По миру" uit-bottom>${pp_rank}</span><span ui-title="По стране" uit-bottom> [${pp_country_rank}]</span></b><br><b>Уровень</b><br><div class="bar"><div class="line"><div style="width: ${levelBar}%;"></div></div><div class="text"><span>${Math.floor(level)}</span><span>${levelBar}%</span><span>${Math.floor(level) + 1}</span></div></div>`
            }
        }
    }

    // ? Authenticator

    getAuth(token) {
        return this.speakeasy.totp.verify({ ...Authenticator, token });
    }
}