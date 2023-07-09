<template>
    <div :class="['auth', type]">
        <div class="banner" :style="{ '--image': `url('${image}')` }"></div>
        
        <div>
            <Text class="title" :text="$t(`user.${type === 'login' ? 'auth' : 'create'}.title[0]`)"/>
            <Text class="text" :text="$t('user.create.text')" v-show="type === 'register'"/>

            <Textbox :label="type === 'login' ? `${$t('global.login')} / ${$t('global.email')}` : $t('global.login')"
                :match="type === 'login' ? /(^[a-zA-Z0-9\_]+$)|(\S+@\S+\.\S+)/ : /^[a-zA-Z0-9\_]+$/"
                @input="login = $event?.target?.value"
            />
            <Textbox :label="$t('global.email')" v-show="type === 'register'"
                :match="/\S+@\S+\.\S+/"
                @input="email = $event?.target?.value"
            />
            <Textbox :label="$t('global.password')" type="password"
                :min="8" :max="64"
                @input="password = $event?.target?.value"
            />
            <Textbox :label="$t('global.repeatPassword')" type="password" v-show="type === 'register'"
                :min="8" :max="64"
                @input="repeatPassword = $event?.target?.value"
            />
    
            <Button @click="auth()" :disabled="isValid">
                {{ type === 'login' ? $t('global.sign.in') : $t('user.create.title[1]') }}
            </Button>

            <div class="footer"
                @click="type = type === 'login' ? 'register' : 'login'"
            >
                {{ type === 'login' ? 'Do you want to register?' : 'Already have an account?' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

type TypeAuth = 'login' | 'register';

type Props = {
    token?: {
        access: string;
        refresh: string;
    };
    merge?: {
        main: string;
        now: string;
    };
}

const { $api } = useNuxtApp();

const
    user = useUserStore(),
    notifications = useNotificationsStore(),
    windows = useWindowsStore();

const props = defineProps({
    windowId: { type: Number },
    closeWindow: {
        type: Function,
        default: () => true
    },
    data: { type: String as PropType<TypeAuth> },
    refCode: { type: String, default: '' }
});

const
    type = ref<TypeAuth>('login'),
    login = ref<string>(''),
    email = ref<string>(''),
    password = ref<string>(''),
    repeatPassword = ref<string>(''),
    image = ref<string>('');

const images = {
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


const isValid = computed(() => {
    let _login = valid(login.value),
        _email = valid(email.value),
        _password = valid(password.value),
        _repeatPassword = valid(repeatPassword.value);

    return type.value === 'login' ? (_login || _password) : (_login || _email || _password || _repeatPassword || password.value !== repeatPassword.value);
});


watch(type, (newValue: TypeAuth) => {
    const list = images[newValue];
    
    image.value = list[Math.floor(Math.random() * list.length)];
});


function valid(key: string) {
    return !key || key.trim() === '';
}

async function auth() {
    if (isValid) {
        return notifications.push({
            title: 'Missing fields',
            message: 'You missed a field, or you entered too many spaces.',
            color: 'red',
            icon: 'dislike'
        });
    }

    const [newUser, status, reqProps] = await $api.auth[type.value]({
        login: login.value,
        email: email.value,
        password: password.value,
        repeatPassword: repeatPassword.value
    });

    if (status !== 200) return notifications.push({
        icon: 'exit',
        title: `Error (${status || 501})`,
        message: newUser?.message || 'Server error',
        color: 'var(--red)'
    });

    const { token, merge } = reqProps as Props;

    const save = () => {
        if (token?.refresh) cookies.set('HX_RT', token?.refresh, { days: 365 });
        if (token?.access) cookies.set('HX_AT', token?.access, { days: 7 });

        cookies.delete(['HX_GUAST']);

        user.set(newUser);

        notifications.push({
            title: 'Welcome',
            color: 'green',
            icon: 'like'
        });
    }


    if (merge) {
        windows.create({
            component: 'Merge',
            close: false,
            data: {
                ...(merge || {}),
                save
            }
        });
    } else save();

    windows.close(props.windowId!);
}


onMounted(() => {
    type.value = props.data || 'login';
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