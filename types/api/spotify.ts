// * Current Playing Track
export interface CurrentPlayingArtist {
    id: string;
    name: string;
    type: string;
    url: string;
}

export interface CurrentPlayingTrack {
    id: string;
    name: string;
    previewUrl: string;
    type: 'track' | 'episode';
    image?: string;
    artists?: Array<CurrentPlayingArtist>;
    url: string;
}

export interface CurrentDevice {
    name: string;
    type: string;
    volume_percent: number;
}

export interface CurrentPlayingDevice {
    name: string;
    type: 'computer' | 'smartphone' | 'speaker';
    volume: number;
}

export interface CurrentPlayingPlaylist {
    id: string;
    type: 'episode' | 'artist' | 'playlist' | 'album' | 'show';
    url: string;
}

export interface CurrentPlayingState {
    isPlaying: boolean;
    device: CurrentPlayingDevice;
    type: 'track' | 'episode' | 'ad' | 'unknown';
    playlist?: CurrentPlayingPlaylist;
    track?: CurrentPlayingTrack;
    progress: number;
    duration: number;
}
