const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios').default;
const request = require('request');
const fs = require('fs')

const config = require('./cfg.json');

const spotifyApi = new SpotifyWebApi({
    clientId: ``,
    clientSecret: ``,
    redirectUri: `http://localhost:1000/spotify/callback`
});

spotifyApi.setAccessToken(config.spotify.access)

const Token = {
    steam: ''
}

module.exports.cache = []

const setParam = (param, token) => {
    let data = config;
    data[param] = token;
    fs.writeFile('./cfg.json', JSON.stringify(data), { encoding: 'utf-8' }, (err) => {
        console.log(`Write[${param}] - ${token}`);
    })
}

const getTokenSpotify = async ({ access, refresh }) => {
    spotifyApi.setRefreshToken(refresh);

    try {
        const { body } = await spotifyApi.refreshAccessToken()
        setParam('spotify', { access: body.access_token, refresh: refresh })
        spotifyApi.setAccessToken(body.access_token);
        setInterval(() => getTokenSpotify(refresh), (body.expires_in * 1000) - 20000)
        return body;
    } catch (err) {
        return err;
    }
}
module.exports.getSpotifyState = async () => {
    let data = {}
    const { body } = await spotifyApi.getMyCurrentPlaybackState()
    const me = await (await spotifyApi.getMe()).body
    if (body.is_playing) {
        let device = {
            Smartphone: 'uil uil-mobile-android',
            Computer: 'uil uil-desktop',
            TV: 'uil uil-tv-retro'
        }
        data = {
            type: 'spotify',
            id: me.id,
            data: {
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
            }
        }
    } else data = { type: 'spotify', id: me.id, data: false }
    return data
}

module.exports.getSteamActivity = async (id) => {
    return await axios(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Token.steam}&steamids=${id}`)
    .then(async ({ data }) => {
        let user = data.response.players[0];
        if (user.gameid) {
            console.log(user);
            return {
                type: 'steam', id,
                data: {
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
                }
            }
        } return { type: 'steam', id, data: false}
    })
}

module.exports.getAccount = async (service, id) => {
    let _data;

    switch(service) {
        case "discord":
            break;
        case "spotify":
            await getTokenSpotify(config.spotify)
            let { body } = await spotifyApi.getMe()
            _data = { username: body.display_name, id: body.id, url: body.external_urls.spotify, avatar: body.images[0].url };
            break;
        case "steam":
            await axios({ url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Token.steam}&steamids=${id}` })
            .then(({ data }) => {
                data = data.response.players.find(f => f.steamid === id);
                _data = { username: data.personaname, id, url: data.profileurl, avatar: data.avatarfull };
            })
            break;
        case "github":
            await axios({ url: `https://api.github.com/user`, headers: { 'User-Agent': 'request', Authorization: `token ${config.github}` } })
            .then(({ data }) => {
                _data = { username: data.name, url: data.html_url, avatar: data.avatar_url };
            })
            break;
        case "minecraft":
            await axios({ url: `https://sessionserver.mojang.com/session/minecraft/profile/${config.minecraft}` })
            .then(({ data }) => {
                _data = { username: data.name, url: `https://ru.namemc.com/profile/${data.name}.1`, avatar: `https://crafatar.com/avatars/${config.minecraft}?overlay=true` }
            })
            break;
    }

    return _data;
}

module.exports.cfg = config;
