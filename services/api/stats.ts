import type { API } from '.';
import type { Response } from '~/types/api';

// * Types
import type { User, Project, AllTimeSinceToday, TypeRange, Stats } from '~/types/api/stats';


interface StatsOptions {
    project?: string;
    language?: string;
    editor?: string;
    operatingSystem?: string;
    machine?: string;
    label?: string;
}


export default class Route {
    private api;

    constructor(api: API) {
        this.api = api;
    }


    user() {
        return this.api.fetch<User>(`/stats/waka/profile`);
    }

    projects() {
        return this.api.fetch<Array<Project>>(`/stats/waka/projects`);
    }

    allTimeSinceToday() {
        return this.api.fetch<AllTimeSinceToday>(`/stats/waka/all_time_since_today`);
    }

    stats(range: TypeRange, options: StatsOptions = {}) {
        return this.api.fetch<Stats>(`/stats/waka/stats`, {
            query: {
                ...options,
                range,
                operating_system: options?.operatingSystem || ''
            }
        });
    }
}