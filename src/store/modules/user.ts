import type { StoreOptions } from 'vuex';

import type { IUser } from '../../libs/api/routes/users';

interface State {
    user: IUser;
}

const module: StoreOptions<State> = {
    state: {
        user: {
            _id: '',
            isRegistered: false
        }
    },
    mutations: {
        'user:set'(state: State, user: IUser) {
            state.user = user;
        }
    },
    actions: {
        setUser({ commit }, user: IUser) {
            return commit('user:set', user);
        }
    },
    getters: {
        getUser(state: State): IUser {
            return state.user;
        }
    }
}

export default module;