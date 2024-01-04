// * Routes
import { API } from '~/services/api';
import Auth from '~/services/api/auth';
import Users from '~/services/api/users';
import Configs from '~/services/api/configs';


export default defineNuxtPlugin(nuxtApp => {
    const { apiURL } = nuxtApp.$config.public;

    const api = new API(apiURL, cookies?.get('HX_AT') || '', cookies?.get('HX_RT') || '');

    const
        auth = new Auth(api),
        users = new Users(api),
        configs = new Configs(api);

    return {
        provide: {
            api: {
                api,
                auth,
                users,
                configs
            }
        }
    }
});