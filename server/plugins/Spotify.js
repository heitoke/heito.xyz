const axios = require('axios');

let cache = {},
    spotifyUserTokens = {};

module.exports = class FileSystem {
    constructor() {
        this.url = 'https://api.spotify.com/v1';

        this.cache = cache;
        this.spotifyUserTokens = spotifyUserTokens;
    }

    msInMin(ms) {
        let min = Math.floor((ms / 1000 / 60) << 0),
            sec = Math.floor((ms / 1000) % 60);
        return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
    }
    
    async getAccount(param, type = 'user') {
        try {
            let { data } = await axios.get(`${this.url}/me`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${type === 'user' ? this.spotifyUserTokens[param]?.token : param}`
                }
            });
            this.cache[data.id] = { last: Date.now(), data }
            return this.cache[data.id].data;
        } catch (err) {
            console.log(`GetAccount`, err.response.data);
        }
    }

    async getActivity(userId) {
        try {
            let { data } = await axios.get(`${this.url}/me/player`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.spotifyUserTokens[userId]?.token}`
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
            console.log(`GetActivity`, err.response.data);
            return { error: true }
        }
    }

    async refreshToken(token) {
        try {
            let { data } = await axios({
                url: `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${token}`,
                headers: { 
                    'Authorization': `Basic ${new Buffer(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST'
            }),
                user = await this.getAccount(data.access_token, 'token');

            this.spotifyUserTokens[token] = this.spotifyUserTokens[user.id] = { date: Date.now(), userId: user.id, token: data.access_token };

            return user.id;
        } catch (err) {
            console.log(`RefreshToken`, err);
        }
    }

    async getTopItems(userId, type = 'tracks') {
        if (!this.spotifyUserTokens[userId]) return { status: 404 };
        try {
            let { data } = await axios.get(`${this.url}/me/top/${type}?limit=50`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.spotifyUserTokens[userId]?.token}`
                }
            });
            return data;
        } catch (err) {
            console.log(`GetTopItems`, err.response.data);
        }
    }

    async getHistory(userId) {
        if (!this.spotifyUserTokens[userId]) return { status: 404 };
        try {
            let { data } = await axios.get(`${this.url}/me/player/recently-played?limit=50`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.spotifyUserTokens[userId]?.token}`
                }
            });
            return data;
        } catch (err) {
            console.log(`GetHistory`, err.response.data);
        }
    }

    async getPlaylists(userId) {
        if (!this.spotifyUserTokens[userId]) return { status: 404 };
        try {
            let { data } = await axios.get(`${this.url}/me/playlists?limit=50`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.spotifyUserTokens[userId]?.token}`
                }
            });
            return data;
        } catch (err) {
            console.log(`GetPlaylists`, err.response.data);
        }
    }
}