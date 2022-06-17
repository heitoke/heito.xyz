<template>
    <div class="main-header">
        <div class="logo" @click="router(`/`)">
            <span class="font-3" data-glitch="heito.xyz" ref="logo"
                @mouseenter="$refs.logo.classList.add('glitch')"
                @mouseleave="$refs.logo.classList.remove('glitch')"
            >
                heito.xyz
            </span>
            <div class="save" v-if="getContentEdited" @click="updateContent(getContent)">
                <i class="uil uil-check"></i>
            </div>
        </div>
        <ul class="menu">
            <li @click="setSuper('auto')">
                <i class="uil uil-clapper-board"></i>
            </li>
            <li @click="setMenu(['SettingsMenu'])">
                <i class="uil uil-setting"></i>
            </li>
            <div class="login" v-if="getLocal?.profile && !getLogin" @click="setMenu(['LoginMenu'])">
                <i class="uil uil-user"></i>
            </div>
            <div class="profile" v-if="getLocal?.profile && getLogin" @click="setContextMenu(['profile', 'left fixed'])">
                <img :src="getUser?.avatar">
            </div>
        </ul>

        <ContextMenu name="profile">
            <ul>
                <li @click="exit()">
                    <i class="uil uil-signout" style="color: var(--C5);"></i>
                    <span>Log out</span>
                </li>
            </ul>
        </ContextMenu>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'MainHeader',
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
        ...mapActions(['setTheme']),
        exit() {
            this.setLocal(['token', false]);
            this.setUser(null);
            this.setLogin(false);
        }
    },
    async mounted() {
        if (!this.getLocal?.profile || !this.getLocal?.token) return;
        let user = await this.fetch(`/users/auth?token=${this.getLocal?.token}`);
        if (user?.status === 404 || user?.status === 401) return this.setLocal(['token', false]);
        else if (user?.status === 200) {
            this.setUser(user);
            this.setLogin(true);
        }
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

        span {
            cursor: pointer;
            letter-spacing: 0;
            transition: .2s;

            &:hover {
                transform: scale(1.2) rotate(-5deg);
            }
        }

        .save {
            cursor: pointer;
            margin: 0 0 0 12px;
            width: 28px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            border-radius: 5px;
            background: var(--C2-alt);
            transition: .2s;
            
            &:active {
                transform: scale(.5);
            }
        }
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

        div.login {
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

        div.profile {
            cursor: pointer;
            margin: 0 0 0 12px;

            img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
            }
        }
    }
}

</style>
