export const replaceImageLanguage: { [key: string]: string } = {
    'c#': 'csharp',
    'c++': 'cpp',
    'scss': 'sass',
    'tsx': 'react',
    'git config': 'git',
    'vim config': 'vim',
    'text': 'file',
    'bash': 'console',
    'sh': 'console',
    'conf': 'settings'
};


export const listRangeTypes = [
    'today',
    'yesterday',
    'week',
    'month',
    'year',
    '7_days',
    'last_7_days',
    '30_days',
    'last_30_days',
    '6_months',
    'last_6_months',
    '12_months',
    'last_12_months',
    'last_year',
    'any',
    'all_time'
] as const;

export type TypeRange = typeof listRangeTypes[number];


// *
interface TemplateStat {
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    seconds: number;
    text: string;
    total_seconds: number;
}


// * User
export interface User {
    id: string;
    display_name: string;
    full_name:string;
    email: string;
    is_email_public: boolean;
    is_email_confirmed: boolean;
    timezone: string;
    last_heartbeat_at: string;
    last_project: string;
    last_plugin_name: string;
    username: string;
    website: string;
    created_at: string;
    modified_at: string;
    photo: string;
}


// * Projects
export interface Project {
    id: string;
    name: string;
    last_heartbeat_at: string;
    human_readable_last_heartbeat_at: string;
    urlencoded_name: string;
    created_at: string;
}


// * Editors
export interface Editor extends TemplateStat {};


// * Languages
export interface Language extends TemplateStat {};


// * Machines
export interface Machine extends TemplateStat {};


// * Operating Systems
export interface System extends TemplateStat {};


// *
export interface AllTimeSinceToday {
    total_seconds: number;
    text: string;
    is_up_to_date: boolean;
    range: {
        end: string;
        end_date: string;
        start: string;
        start_date: string;
        timezone: string;
    };
}


// * Stats
export interface Stats {
    username: string;
    user_id: string;
    start: string;
    end: string;
    status: 'ok',
    total_seconds: number;
    daily_average: number;
    days_including_holidays: number;
    range: TypeRange;
    human_readable_range: string;
    human_readable_total: string;
    human_readable_daily_average: string;
    is_coding_activity_visible: boolean;
    is_other_usage_visible: boolean;
    editors: Array<Editor>;
    languages: Array<Language>;
    machines: Array<Machine>;
    projects: Array<TemplateStat>;
    operating_systems: Array<System>;
}