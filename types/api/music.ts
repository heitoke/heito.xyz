export interface IPlaylist {
    id: string;
    name: string;
    description: string;
    collaborative: boolean;
    url: string;
    image: string;
    public: boolean;
    totalTracks: number;
    primary_color: string | null;
    owner: {
        id: string;
        displayName: string;
        url: string;
    }
}

export interface IArtist {
    id: string;
    name: string;
    genres: Array<string>;
    image: string;
    popularity: number;
    followers: {
        href: string | null;
        total: number;
    };
    url: string;
}

export interface IArtistTrack {
    id: string;
    name: string;
    url: string;
}

export interface IAlbum {
    id: string;
    name: string;
    image: string;
    artists: Array<IArtistTrack>;
    url: string;
    releaseDate: string;
    totalTracks: number;
}

export interface ITrack {
    id: string;
    name: string;
    image: string;
    duration: number;
    artists: Array<IArtistTrack>;
    url: string;
    previewUrl: string | null;
    popularity: number;
    album: IAlbum;
    addedBy?: {
        id: string;
        url: string;
    };
    addedAt?: string;
}

export interface IPlaylistPlus extends IPlaylist {
    tracks: {
        list: Array<ITrack>,
        total: number;
    }
}

export interface IRecentlyTrack extends ITrack {
    playedAt: string;
}