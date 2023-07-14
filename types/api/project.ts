import type { IUser } from "./user";

export interface ILink {
    label: string;
    text: string;
    icon: string;
    img: string;
    color: string;
    url: string;
    updatedAt: Date;
    createdAt: Date;
}

export enum EProjectPermission {
    Member = 'member',
    Moderator = 'moderator',
    Admin = 'admin',
    Owner = 'owner'
}

export interface IProjectMember {
    member: IUser;
    permission: EProjectPermission;
    updatedAt: Date;
    joinedAt: Date;
}

export interface IProject {
    _id: string;
    private?: boolean;
    name?: string;
    displayName?: string;
    image?: string;
    banner?: string;
    description?: string;
    color?: string;
    verified?: boolean;
    isDeleted?: boolean;
    members?: Array<IProjectMember>;
    links?: Array<ILink>;
    tags?: Array<string>;
    updatedAt?: Date;
    createdAt?: Date;
}


// * Repositories

export interface IRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        html_url: string;
        type: string;
        site_admin: boolean;
    };
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