<template>
    <div :class="['auth', type]">
        <img class="banner" :src="image" alt="Auth Image">

        <div>
            <div class="title">{{ type === 'login' ? 'Authorization' : 'Create account' }}</div>

            <div class="text">{{ type === 'login' ? '' : 'This is necessary so that when you access this site from other browsers or devices, you can log into the same account with the same data. We use your IP to understand if you already have a user.' }}</div>


            <Textbox :label="type === 'login' ? 'Login' : 'Username'"
                :value="login"

                @update="login = $event"
            />

            <Textbox label="Email" v-if="type === 'register'"
                :value="email"

                @update="email = $event"
            />
        
            <Textbox label="Password"
                type="password"

                @update="password = $event"
            />
            
            <Textbox label="Repeat password" v-if="type === 'register'"
                type="password"

                @update="repeatPassword = $event"
            />

            <Button
                :label="type === 'login' ? 'Sign in' : 'Create account'"
                :disabled="!isValidForm"

                @click="onClickAuth"
            />

            <div class="guast">
                <div class="text">Your authorized account will be merged with the guest account</div>

                <div class="user">
                    <img :src="$user.getAvatar" alt="Guast Avatar">

                    <span>{{ $user.user?.displayName || $user.user?.username }}</span>

                    <Checkbox :value="isMerge"
                        @update="isMerge = $event"
                    />
                </div>
            </div>

            <div class="footer"
                @click="type = type === 'login' ? 'register' : 'login'"
            >
                {{ type === 'login' ? 'Do you want to register?' : 'Already have an account?' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

type TypeAuth = 'login' | 'register';


const { $api } = useNuxtApp();

const
    $user = useUserStore(),
    $notifications = useNotificationsStore(),
    $windows = useWindowsStore();


const props = defineProps<{
    windowId: number;
    data: {
        type: TypeAuth;
    };
    close(): void;
}>();


const
    type = ref<TypeAuth>('login'),
    login = ref(''),
    email = ref(''),
    password = ref(''),
    repeatPassword = ref(''),
    image = ref(''),
    isMerge = ref(true);

    
const
    regexUsername = /^[a-zA-Z0-9\_]+$/,
    regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const images = {
    login: [
        'https://donatepay.ru/uploads/notification/images/214729_1552398174.gif',
        'https://media.tenor.com/4jSG_Q1SBjUAAAAM/mushoku-tensei-anime.gif',
        'https://usagif.com/wp-content/uploads/gif/anime-hug-12.gif',
        'https://media.tenor.com/J8jGbajVrNUAAAAd/anime-lafanpan.gif',
        'https://usagif.com/wp-content/uploads/gif/anime-sleep-78.gif',
        'https://i.pinimg.com/originals/87/5c/90/875c90f150bdb37b37e8aad42b7d17a1.gif'
    ],
    register: [
        'https://i.pinimg.com/originals/99/ea/48/99ea48ec7a3d63e77186302e8d85426e.gif',
        'https://media.tenor.com/HwMm88Olb14AAAAC/k-on-yui.gif',
        'https://i.pinimg.com/originals/2d/fa/77/2dfa7709f6a014cd2e331cad67fa0f46.gif'
    ]
}


const isValidEmail = computed(() => {
    return email.value !== '' && regexEmail.test(email.value);
});

const isValidLogin = computed(() => {
    if (login.value === '' || login.value.trim() === '' || login.value.length < 3) return false;

    if (type.value === 'register') return regexUsername.test(login.value);

    return regexUsername.test(login.value) || regexEmail.test(login.value);
});

const isValidPassword = computed(() => {
    return password.value !== '' && password.value.length > 7;
});

const isValidForm = computed(() => {
    return isValidLogin.value && isValidPassword.value && (type.value === 'login' ? true : (isValidEmail.value && password.value === repeatPassword.value))
});


watch(() => type.value, (newValue) => {
    if (newValue === 'register') {
        if (regexEmail.test(login.value)) {
            email.value = login.value;
            login.value = '';
        }
    } else if (newValue === 'login' && !login.value) {
        login.value = email.value;
    }
    
    setImage();
});


function setImage() {
    const list = images[type.value];

    image.value = list[Math.floor(Math.random() * list.length)];
}

async function onClickAuth() {
    const isLogin = type.value === 'login';

    const { data, error, status } = await $api.auth[type.value](...[
        login.value,
        isLogin ? password.value : email.value,
        password.value
    ]);

    if (status.value !== 'success') return;

    const { user, tokens: { access, refresh } } = data;

    if (access) {
        $api.api.setAccessToken(access!);

        cookies.set('HX_AT', access, { days: 7 });
    }

    if (refresh) {
        $api.api.setRefreshToken(refresh!);

        cookies.set('HX_RT', refresh, { days: 365 });
    }

    $user.set(user);

    $notifications.push(type.value === 'login' ? {
        title: 'Oh, who have we got here',
        text: 'Are you back, for how long?',
        color: 'var(--green)',
        icon: 'pacman'
    } :{
        title: 'Uh-huh',
        text: 'Welcome to join us',
        color: 'var(--green)',
        icon: 'hand-alt'
    });

    props.close();
}


onMounted(() => {
    type.value = props.data.type || 'login';

    setImage();
});

</script>

<style lang="scss" scoped>

.block.auth {
    display: flex;
    position: relative;
    transition: .2s;

    &.login {
        max-width: 315px;
        min-width: 315px;
        flex-direction: column;

        .banner {
            margin: 0 0 12px 0;
            min-height: 215px;
        }
    }

    &.register {
        max-width: 512px;
        min-width: 512px;
        flex-direction: row;

        .banner {
            margin: 0 12px 0 0;
            max-width: 215px;
            min-width: 215px;
        }
    }

    .banner {
        border-radius: 5px;
        overflow: hidden;
        object-fit: cover;
        object-position: center;
    }

    .banner + div {
        max-width: 100%;
        min-width: 0;
    }

    .title {
        font-size: 24px;
    }

    .text {
        margin: 8px 0 16px 0;
        color: var(--text-secondary);
        font-size: 12px;
    }

    .ui-textbox {
        margin-bottom: 12px;
    }

    .ui-button {
        width: 100%;
    }

    .guast {
        display: flex;
        margin: 8px 0;
        padding: 8px;
        border: 1px solid var(--background-secondary);
        border-left: none;
        border-right: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .text {
            margin: 0;
            max-width: 80%;
            font-size: 10px;
            text-align: center;
        }

        .user {
            display: flex;
            margin-top: 8px;
            max-width: 90%;
            align-items: center;
            
            img {
                min-width: 20px;
                height: 20px;
                border-radius: 50%;
                object-fit: cover;
                object-position: center;
            }
    
            span {
                margin: 0 8px;
                max-width: 100%;
                color: var(--text-secondary);
                font-size: 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }

    .footer {
        cursor: pointer;
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