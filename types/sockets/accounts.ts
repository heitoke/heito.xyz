// * Steam

export interface ISteamAccountGame {
    id: string;
    name: string;
    benner: string;
    capsule: string;
    store: string;
}

export interface ISteamAccount {
    id: string;
    name: string;
    avatar: string;
    realname: string;
    url: string;
    status: number;
    statusName: string;
    game?: ISteamAccountGame | null
}

export const steamStatus = [
    'Offline',
    'Online',
    'Busy',
    'Away',
    'Snooze',
    'Looking to trade',
    'Looking to play'
];


// ! -----------------------------------------


// * GitHub
export interface IGitHubAccount {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: 'User';
    site_admin: string | boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: true;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}


// ! -----------------------------------------


// * Tetr.io
export interface ITetrAccount {
    _id: string;
    username: string;
    role: 'user';
    ts: string;
    badges: any[];
    xp: number;
    gamesplayed: number;
    gameswon: number;
    gametime: number;
    country: string;
    country_flag: string;
    supporter_tier: number;
    verified: boolean;
    league: {
        gamesplayed: number;
        gameswon: number;
        rating: number;
        glicko: number;
        rd: number;
        rank: string;
        bestrank: string;
        apm: number;
        pps: number;
        vs: number;
        decaying: boolean;
        standing: number;
        standing_local: number;
        prev_rank: number;
        prev_at: number;
        next_rank: number;
        next_at: number;
        percentile: number;
        percentile_rank: string;
    },
    avatar_url: string;
    avatar_revision: number;
    connections: object;
    friend_count: number;
}


// ! -----------------------------------------


// * Twitch
export interface ITwitchAccount {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
}


// ! -----------------------------------------


// * OSU
export type IOSUGameMode = 'fruits' | 'mania' | 'osu' | 'taiko';

export interface IOSUAccount {
    id: number;
    avatar_url: string;
    cover_url: string;
    username: string;
    profile_colour: string;
    website: string;
    is_active: boolean;
    is_online: boolean;
    is_ranked: boolean;
    is_supporter: boolean;
    last_visit: string;
    join_date: string;
    pp: number;
    global_rank: number;
    country_rank: number;
}