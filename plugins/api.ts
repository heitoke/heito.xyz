// * Routes
import { API } from '~/services/api';
import Auth from '~/services/api/auth';
import Users from '~/services/api/users';
import Configs from '~/services/api/configs';
import Projects from '~/services/api/projects';
import Stats from '~/services/api/stats';


export default defineNuxtPlugin(nuxtApp => {
    const { apiUrl } = nuxtApp.$config.public;

    const api = new API(apiUrl, cookies?.get('HX_AT') || '', cookies?.get('HX_RT') || '');

    const
        auth = new Auth(api),
        users = new Users(api),
        configs = new Configs(api),
        projects = new Projects(api),
        stats = new Stats(api);

    return {
        provide: {
            api: {
                api,
                auth,
                users,
                configs,
                projects,
                stats
            }
        }
    }
});