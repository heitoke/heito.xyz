import type { User, Link } from './user';

export enum LogCodes {
    Update = 0
}

export enum NotficationCodes {}


export enum MemberPermission {
    Invited = 'invited',
    Member = 'member',
    Owner = 'owner'
}

export interface Member {
    member: User;
    permissions: number; // MemberPermission

    updatedAt: Date;
    joinedAt: Date;
}

export interface Project {
    _id: string;

    private?: boolean;

    name?: string;
    displayName: string;

    description?: string;

    links: Array<Link>;
    members: {
        total: number;
        list: Array<Member>;
    };

    updatedAt: string;
    createdAt: string;
}


// * Repositories
export interface RepositoryOwner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    html_url: string;
    type: string;
    site_admin: boolean;
}

export interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: RepositoryOwner;
    html_url: string;
    description: string;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    clone_url: string;
    homepage: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;
    forks_count: number;
    mirror_url: string | null,
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: string | null;
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    topics: Array<string>;
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
}