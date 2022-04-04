<template>
    <div class="profile-login">
        <!-- <div class="title">Token</div> -->
        <!-- <ul class="buttons">
            <Button text="Sign In" @click="type = 'login'"/>
            <Button text="Sign Up" @click="type = 'register'"/>
        </ul> -->
        <div v-if="type === 'login'">
            <div class="subtitle">Username</div>
            <Text @onEvent="username = $event"/>
            <div class="subtitle">Password</div>
            <Text type="password" @onEvent="password = $event"/>
            <label class="group" style="margin: 12px 0 0 0;">
                <Check type="square" @onEvent="re_me = $event"/>
                <span>Remember me</span>
            </label>
            <Button text="Back to basics" style="margin: 12px 0 0 0;" @click="auth()"/>
        </div>
        <!-- <div v-if="type === 'register'">
            <div class="subtitle">Username</div>
            <Text @onEvent="username = $event"/>
            <div class="subtitle">Email</div>
            <Text @onEvent="email = $event"/>
            <div class="subtitle">Password</div>
            <Text type="password" @onEvent="password = $event"/>
            <div class="subtitle">Password Repetition</div>
            <Text type="password" @onEvent="re_password = $event"/>
            <Button text="Start the journey" style="margin: 12px 0 0 0;" @click="auth()"/>
        </div> -->
        <!-- <div class="already" @click="setMenu(['AccountsMenu'])" v-if="getLocal?.accounts?.length > 0 && this?.data?.login">Already entered</div> -->
    </div>
</template>

<script>

export default {
    name: 'SettingsMenu',
    components: {},
    computed: {},
    props: {
        data: { type: Object, default() { return { login: true } } },
        id: { type: Number }
    },
    data() {
        return {
            type: 'login',
            username: '',
            password: '',
            email: '',
            re_password: '',
            token: '',
            re_me: false
        }
    },
    methods: {
        async auth() {
            let types = {
                'login': `username=${this.username}&password=${this.password}`,
                'register': `username=${this.username}&email=${this.email}&password=${this.password}`,
                'token': `token=${this.token}`
            }[this.type];
            if (this.type === 'register' && this.password !== this.re_password) return;
            let { status, token } = await this.fetch(`/auth?type=${this.type}&${types}`);
            if (status === 200) {
                if (this.type === 'register') return this.type = 'login';
                if (this?.data?.login) {
                    this.setUser(await this.fetch(`/users`, { token }, 'POST'));
                    this.setLogin(true);
                    this.setLocal(['token', token]);
                }
                if (this.re_me && !this.getLocal?.accounts?.find(item => item?.token === token)) {
                    let newAccount = { token, joinedAt: Date.now() };
                    if (this.getLocal?.accounts) this.setLocal(['accounts', [ ...this.getLocal?.accounts, newAccount ]]);
                        else this.setLocal(['accounts', [ newAccount ]]);
                }
                this?.data?.click ? this?.data?.click() : null;
                this.closeMenu(this.id);
            } else {
                this.setUser(null);
                this.setLogin(false);
            }
        }
    },
    mounted() {}
}
</script>

<style lang="scss" scoped>

.block.profile-login {
    padding: 12px;
    min-width: 320px;
    border-radius: 5px;
    background: var(--bg);

    .title {
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        text-transform: uppercase;
    }

    .subtitle {
        margin: 4px;
        color: var(--color-2);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .group {
        display: flex;
        font-size: 14px;
        align-items: center;
        user-select: none;

        span {
            margin: 0 0 0 8px;
        }
    }

    .buttons {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;
        column-gap: 12px;

        .field-button {
            width: 100%;
        }
    }

    .already {
        cursor: pointer;
        margin: 12px 0 0 0;
        color: var(--color-2);
        font-size: 12px;
        text-align: center;
        transition: .2s;

        &:hover {
            color: var(--main-color);
        }
    }
}

</style>