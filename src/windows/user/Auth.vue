<template>
    <div :class="['auth', type]">
        <div class="banner" :style="{ '--image': `url('${image}')` }"></div>
        
        <div>
            <Text class="title" :text="getLang.user[type === 'login' ? 'auth' : 'create'].title[0]"/>
            <Text class="text" :text="getLang.user.create.text" v-show="type === 'register'"/>

            <Textbox :label="type === 'login' ? `${getLang.global.login} / ${getLang.global.email}` : getLang.global.login"
                :match="type === 'login' ? /(^[a-zA-Z0-9\_]+$)|(\S+@\S+\.\S+)/ : /^[a-zA-Z0-9\_]+$/"
                @input="login = $event?.target?.value"
            />
            <Textbox :label="getLang.global.email" v-show="type === 'register'"
                :match="/\S+@\S+\.\S+/"
                @input="email = $event?.target?.value"
            />
            <Textbox :label="getLang.global.password" type="password"
                :min="8" :max="64"
                @input="password = $event?.target?.value"
            />
            <Textbox :label="getLang.global.repeatPassword" type="password" v-show="type === 'register'"
                :min="8" :max="64"
                @input="repeatPassword = $event?.target?.value"
            />
    
            <Button @click="auth()" :disabled="getValid">
                {{ type === 'login' ? getLang.global.sign.in : getLang.user.create.title[1] }}
            </Button>

            <div class="footer"
                @click="type = type === 'login' ? 'register' : 'login'"
            >
                {{ type === 'login' ? 'Do you want to register?' : 'Already have an account?' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import Auth from '../../libs/api/routes/auth';

import { cookies } from '../../libs/utils';

export default defineComponent({
    name: 'WindowAuth',
    components: {},
    computed: {
        ...mapGetters(['getLang']),
        getValid() {
            let login = this.isValid(this.login),
                email = this.isValid(this.email),
                password = this.isValid(this.password),
                repeatPassword = this.isValid(this.repeatPassword);

            return this.type === 'login' ? (login || password) : (login || email || password || repeatPassword || this.password !== this.repeatPassword);
        }
    },
    props: {
        windowId: { type: Number },
        closeWindow: {
            type: Function,
            default: () => 1
        },
        data: { type: String as PropType<'login' | 'register'> },
        refCode: { type: String, default: '' }
    },
    data: () => ({
        type: 'login' as 'login' | 'register',
        login: '',
        email: '',
        password: '',
        repeatPassword: '',
        image: '',
        images: {
            login: [
                'https://donatepay.ru/uploads/notification/images/214729_1552398174.gif',
                'https://media.tenor.com/4jSG_Q1SBjUAAAAM/mushoku-tensei-anime.gif',
                'https://thumbs.gfycat.com/GoldenImmaterialItaliangreyhound-max-1mb.gif',
                // 'https://otvet.imgsmail.ru/download/243586606_f224c072ed6df61a9242c6fc2995686a_800.gif',
                'https://usagif.com/wp-content/uploads/gif/anime-hug-12.gif'
            ],
            register: [
                'https://thumbs.gfycat.com/DenseDrearyAfricanwildcat-size_restricted.gif',
                'https://i.pinimg.com/originals/99/ea/48/99ea48ec7a3d63e77186302e8d85426e.gif',
                'https://media.tenor.com/HwMm88Olb14AAAAC/k-on-yui.gif'
            ]
        }
    }),
    watch: {
        type(newValue: 'login' | 'register') {
            let list = this.images[newValue];
            this.image = list[Math.floor(Math.random() * list.length)];
        }
    },
    methods: {
        ...mapActions(['setUser', 'createWindow']),
        isValid(key: string) {
            return !key || key.trim() === '';
        },
        async auth() {
            if (this.getValid) {
                return this.$notifications.push({
                    title: 'Missing fields',
                    message: 'You missed a field, or you entered too many spaces.',
                    color: 'red',
                    icon: 'dislike'
                });
            }

            let [newUser, status, props] = await Auth[this.type]({ login: this.login, email: this.email, password: this.password, repeatPassword: this.repeatPassword });

            if (status !== 200) return;

            const save = () => {
                if (props?.token?.refresh) cookies.set('HX_RT', props?.token?.refresh, { days: 365 });
                if (props?.token?.access) cookies.set('HX_AT', props?.token?.access, { days: 7 });
    
                cookies.delete(['HX_GUAST']);

                this.setUser(newUser);

                this.$notifications.push({
                    title: 'Welcome',
                    color: 'green',
                    icon: 'like'
                });
            }


            if (props?.merge) {
                this.createWindow({
                    component: 'Merge',
                    close: false,
                    data: {
                        ...props.merge,
                        save: () => {
                            save();
                        }
                    }
                });
            } else save();

            this.closeWindow();
        },
    },
    mounted() {
        this.type = this.data || 'login';
    }
});

</script>

<style lang="scss" scoped>

.block.auth {
    display: flex;
    max-width: 576px;
    min-width: 576px;
    position: relative;
    transition: .2s;

    &.login {
        max-width: 376px;
        min-width: 376px;
        flex-direction: column;

        .banner {
            margin: 0 0 12px 0;
            min-height: 215px;
        }
    }

    &.register {
        flex-direction: row;

        .banner {
            margin: 0 12px 0 0;
            min-width: 215px;
        }
    }

    .banner {
        border-radius: 5px;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
    }

    .title {
        font-size: 24px;
        font-weight: 700;
    }

    .text {
        margin: 8px 0 0 0;
        color: var(--text-secondary);
        font-size: 13px;
    }

    .ui-textbox {
        margin: 12px 0 0 0;
    }

    .ui-button {
        margin: 12px 0 0 0;
    }
    
    .footer {
        cursor: pointer;
        margin: 12px 0 0 0;
        color: var(--text-secondary);
        font-size: 12px;
        text-align: center;
        transition: .2s;

        &:hover {
            color: var(--text-primary);
            text-decoration: underline;
        }
    }
}

</style>