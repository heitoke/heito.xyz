<template>
    <div class="main-header">
        <div class="logo font-3" @click="router(`/`)">heito.xyz</div>
        <ul class="menu">
            <li @click="setMenu(['SettingsMenu'])">
                <i class="uil uil-setting"></i>
            </li>
            <div class="profile" v-if="getLocal?.profile" @click="setMenu(['LoginMenu'])">
                <i v-if="!getLogin" class="uil uil-user"></i>
                <!-- <img v-else :src=""> -->
            </div>
        </ul>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'MainSidebar',
    computed: {
        ...mapGetters(['getTheme'])
    },
    components: {},
    data() {
        return {
            opened: false
        }
    },
    methods: {
        ...mapActions(['setTheme'])
    },
    async mounted() {
        // if (!this.getLocal?.profile || !this.getLocal?.token) return;
        // let user = await this.fetch('/users', { token: this.getLocal?.token }, 'POST');
        // if (user.status === 404 || user.status === 401) return this.setLocal(['token', false]);
        // else if (user.username) {
        //     this.setUser(user);
        //     this.setLogin(true);
        // }
    }
}

</script>

<style lang="scss" scoped>

.main-header {
    display: flex;
    padding: 0 24px;
    width: calc(100% - 48px);
    height: 48px;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    z-index: 100;

    .logo {
        display: flex;
        align-items: center;
    }

    .menu {
        display: flex;
        align-items: center;

        li {
            cursor: pointer;
            margin: 0 0 0 12px;
            width: 28px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            transition: .2s;

            &:hover {
                border-radius: 5px;
                background: var(--dimming);
            }

            &:active {
                transform: rotate(-45deg) scale(.9);
            }

            &:last-child {
                margin: 0;
            }
        }

        div.profile {
            cursor: pointer;
            margin: 0 0 0 12px;
            width: 32px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            transition: .2s;

            &:hover {
                border-radius: 5px;
                background: var(--dimming);
            }
        }
    }
}

</style>
