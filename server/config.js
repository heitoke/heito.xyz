const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios').default;

const { spotify, steam, minecraft } = require('./cfg.js');

const spotifyApi = new SpotifyWebApi({
    clientId: spotify.id,
    clientSecret: spotify.secret,
    redirectUri: `http://localhost:1000/spotify/callback`
});

// spotifyApi.setAccessToken(spotify.tokens.access)

const getTokenSpotify = async (refresh) => {
    spotifyApi.setRefreshToken(refresh);

    try {
        const { body } = await spotifyApi.refreshAccessToken()
        // spotify.tokens = { access: body.access_token, refresh }
        spotifyApi.setAccessToken(body.access_token);
        setInterval(() => getTokenSpotify(), (body.expires_in * 1000) - 50000)
        return body;
    } catch (err) {
        return err;
    }
}

module.exports.getAccountInfo = async ({ type, params }) => {
    let _data;

    switch(type) {
        case "spotify":
            await getTokenSpotify(params.refresh)
            let { body } = await spotifyApi.getMe()
            _data = { username: body.display_name, id: body.id, url: body.external_urls.spotify, avatar: body.images[0].url };
            break;
        case "steam":
            await axios({ url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam.key}&steamids=${params.id}` })
            .then(({ data }) => {
                data = data.response.players.find(f => f.steamid === params.id);
                _data = { username: data.personaname, id: params.id, url: data.profileurl, avatar: data.avatarfull };
            })
            break;
        case "github":
            await axios({ url: `https://api.github.com/users/${params.login}` })
            .then(({ data }) => {
                _data = { username: data.login, id: data.id, url: data.html_url, avatar: data.avatar_url };
            })
            break;
        case "minecraft":
            await axios({ url: `https://sessionserver.mojang.com/session/minecraft/profile/${params.uuid}` })
            .then(({ data }) => {
                _data = { username: data.name, url: `https://ru.namemc.com/profile/${data.name}.1`, avatar: `https://crafatar.com/avatars/${params.uuid}?overlay=true` }
            })
            break;
    }

    return _data;
}

const getSpotifyActivity = async ({ access }) => {
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

const getGitHubInfo = async login => {
    return await axios(`https://api.github.com/users/${login}`)
    .then(({ data }) => {
        return {
            type: 'github',
            id: data.id,
            data: {
                action: 'Информация',
                name: data.name,
                state: `Репозиториев: ${data.public_repos}`
            }
        }
    })
}

const getSteamActivity = async id => {
    return await axios(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam.key}&steamids=${id}`)
    .then(async ({ data }) => {
        let user = data.response.players[0];
        if (user.gameid) {
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

module.exports.getAccountActivity = async ({ type, params }) => {
    let _data;

    switch(type) {
        case "spotify":
            _data = await getSpotifyActivity(params)
            break;
        case "github":
            _data = await getGitHubInfo(params.login)
            break;
        case "steam":
            _data = await getSteamActivity(params.id)
            break;
        default:
            _data = false
            break;
    }

    return _data
}

module.exports.services = [
    'spotify',
    'steam',
    'minecraft'
];
