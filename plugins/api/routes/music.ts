import { type IAPI } from '../';

import { DocumentationAPI } from '~/libs/docs';

import type { IPlaylist, IPlaylistPlus, IArtist, ITrack, IRecentlyTrack } from '~/types/api/music';


const docs = new DocumentationAPI('music', {
    path: '/music',
    label: 'Music',
    description: 'Spotify Music Statistics',
    icon: 'music-note',
    version: 'beta'
});

export default class Route {
    private $api: IAPI;

    constructor(api: IAPI) {
        this.$api = api;
    }

    @docs.route({
        label: 'List playlists',
        description: 'Get the entire playlist list',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    playlists(): [{ count: number, results: Array<IPlaylist> }, number, any] {
        return this.$api.get(`/music/playlists`) as any;
    }
    
    @docs.route({
        label: 'Get playlist',
        description: 'Get information about one playlist',
        path: '/:playlistId',
        params: [
            { name: 'playlistId', type: 'string' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'Such a playlist will not find' },
            { code: 501, text: 'Server error' }
        ]
    })
    playlist(playlistId: string): [IPlaylistPlus, number, any] {
        return this.$api.get(`/music/playlists/${playlistId}`) as any;
    }

    @docs.route({
        label: 'Track list in playlist',
        description: 'Get the entire track list in a specific playlist',
        path: '/:playlistId/tracks',
        params: [
            { name: 'playlistId', type: 'string' }
        ],
        queries: [
            { name: 'offset', type: 'number', default: '0' },
            { name: 'limit', type: 'number', default: '100' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'Such a playlist will not find' },
            { code: 501, text: 'Server error' }
        ]
    })
    playlistTracks(playlistId: string, options: { offset: number, limit: number } = { offset: 0, limit: 100 }): [{ count: number, total: number, results: Array<ITrack> }, number, any] {
        return this.$api.get(`/music/playlists/${playlistId}/tracks?offset=${options.offset}&limit=${options.limit}`) as any;
    }


    @docs.route({
        label: 'Top tracks or artists',
        path: '/top/:type',
        description: 'Get top tracks or artists in time',
        params: [
            { name: 'type', type: 'string', enum: { tracks: {}, artists: {} } }
        ],
        queries: [
            { name: 'offset', type: 'number', default: '0' },
            { name: 'limit', type: 'number', default: '100' },
            { name: 'term', type: 'string', enum: { long: {}, medium: {}, short: {} }, default: 'medium' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    top(type: 'tracks' | 'artists' = 'tracks', options: { offset: number, limit: number, term: 'long' | 'medium' | 'short' } = { offset: 0, limit: 50, term: 'medium' }): [{ count: number, results: Array<ITrack | IArtist> }, number, any] {
        return this.$api.get(`/music/top/${type}?offset=${options.offset || 0}&limit=${options.limit || 50}&term=${options.term || 'medium'}`) as any;
    }


    @docs.route({
        label: 'Recent track list',
        path: '/recently',
        description: 'Get a list of tracks that have been recently',
        queries: [
            { name: 'limit', type: 'number', default: '50' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    recently(limit: number = 50): [{ count: number, results: Array<IRecentlyTrack> }, number, any] {
        return this.$api.get(`/music/recently?limit${limit}`) as any;
    }


    @docs.route({
        label: 'Saved tracks, albums or shows',
        path: '/saved/:type',
        description: 'Get saved tracks, albums or shows',
        params: [
            { name: 'type', type: 'string', enum: { tracks: {}, albums: {}, shows: {} } }
        ],
        queries: [
            { name: 'offset', type: 'number', default: '0' },
            { name: 'limit', type: 'number', default: '50' },
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    saved(type: 'tracks' | 'albums' | 'shows' = 'tracks', options: { offset: number, limit: number } = { offset: 0, limit: 50 }): [{ count: number, total: number, results: Array<ITrack> }, number, any] {
        return this.$api.get(`/music/saved/${type}?offset=${options.offset || 0}&limit=${options.limit || 50}`) as any;
    }
}