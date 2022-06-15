<template>
    <div class="main">
        <div class="block">
            <ul :class="['services', { open: services }]" v-if="listServices">
                <li class="service">
                    <div class="button" @click="services = !services" @contextmenu="openContextMenu([$event, 'services:settings'])">
                        <i class="uil uil-apps"></i>
                        <span>Services</span>
                    </div>

                    <ContextMenu name="services:settings" v-if="getRole">
                        <ul>
                            <li @click="setMenu(['ServicesListMenu'])">
                                <i class="uil uil-user-square" style="color: var(--C1);"></i>
                                <span>Services settings</span>
                            </li>
                        </ul>
                    </ContextMenu>
                </li>
                <li class="service" v-for="(service, idx) of listServices" :key="(service, idx)">
                    <div class="button" @mouseenter="focusService(idx); serviceAccount(service.type, service.id, service.key)" @mouseleave="blurService(idx)">
                        <icon :data="serviceTypes[service.type]"/>
                        <span>{{ names[service.type] }}</span>
                    </div>
                    <transition enter-active-class="show" leave-active-class="hide">
                        <div class="block" v-if="services || serviceHover[0] === idx" @mouseenter="focusService(idx, true)" @mouseleave="serviceHover = []">
                            <ServiceAccount :data="accounts[`${service.type}:${service.id}`]" v-if="accounts[`${service.type}:${service.id}`]"/>
                            <ServiceActivity v-if="activity[`${service.type}:${service.id}`]" :data="activity[`${service.type}:${service.id}`]"/>
                        </div>
                    </transition>
                </li>
            </ul>
            <div class="content" @contextmenu="openContextMenu([$event, 'main:content'])">
                <!-- <div class="table">
                    ヘ <br>
                    イ <br>
                    ト
                </div> -->
                <div class="info" :style="`border-right: ${!getMobile && getLocal?.models ? '0px solid var(--dimming)' : 'none'};`">
                    <h1 class="glitch font-3" :data-glitch="getContent?.title">
                        <div :class="`status ${isTypeStatus ? mainActivity?.userOnline?.type : (mainActivity?.userOnline || 'offline')}`">
                            <!-- <span>{{ statusNames[mainActivity?.userOnline] || mainActivity?.userOnline }}</span> -->
                            <div @mouseenter="openContextMenu([$event, `toolpic:status`, 'right center-y fixed hover'])"></div>
                        </div>
                        {{ getContent?.title }}
                    </h1>
                    <div class="text" v-html="getContent?.description"></div>
                </div>
                <video class="video" v-if="getContent?.image" :src="require(`../assets/images/${images[Math.floor(Math.random() * images.length)]}.webp`)" autoplay muted loop></video>
                <div class="activity" v-if="getContent?.activity">
                    <ServiceActivity :data="mainActivity?.activity"/>
                </div>
                
                <ContextMenu name="toolpic:status" class="toolpic">
                    <p>
                        Status 
                        <b style="text-transform: uppercase;" v-if="mainActivity?.userOnline">
                            {{ isTypeStatus ? (mainActivity?.userOnline?.value || mainActivity?.userOnline?.type) : (statusNames[mainActivity?.userOnline] || mainActivity?.userOnline) }}
                        </b>
                    </p>
                </ContextMenu>

                <ContextMenu name="main:content" v-if="getRole">
                    <ul>
                        <li @click="setMenu(['SettingsEditMenu', { title: 'Edit title', value: getContent?.title, save: val => setContentKey(['title', val]) }])">
                            <i class="uil uil-text"></i>
                            <span>Edit title</span>
                        </li>
                        <li @click="setMenu(['SettingsEditMenu', { title: 'Edit description', value: getContent?.description, save: val => setContentKey(['description', val]) }])">
                            <i class="uil uil-subject"></i>
                            <span>Edit description</span>
                        </li>
                        <div class="line"></div>
                        <li @click="setContentKey(['image', !getContent['image']])">
                            <i class="uil uil-image" style="color: var(--C7);"></i>
                            <span>{{ getContent?.image ? 'Disable' : 'Enable' }} image</span>
                        </li>
                        <div class="line"></div>
                        <li @click="setContentKey(['activity', !getContent['activity']])">
                            <i class="uil uil-rocket" style="color: var(--C1);"></i>
                            <span>{{ getContent?.activity ? 'Disable' : 'Enable' }} activity</span>
                        </li>
                    </ul>
                </ContextMenu>
            </div>
            <div class="bottom">
                Press the <div class="key" @click="isSuper ? null : setSuper('auto')">Tab</div> key
            </div>
        </div>
    </div>
</template>

<script>

import { defineAsyncComponent } from 'vue';

export default {
    name: 'MainPage',
    components: {
        ServiceAccount: defineAsyncComponent(() => import('../components/services/account.vue')),
        ServiceActivity: defineAsyncComponent(() => import('../components/services/activity.vue'))        
    },
    computed: {
        randomModel() {
            return this.models[Math.floor(Math.random() * this.models.length)];
        },
        isTypeStatus() {
            return this.mainActivity?.userOnline && typeof(this.mainActivity?.userOnline) === 'object';
        }
    },
    data() {
        return {
            image: 'https://i.kym-cdn.com/photos/images/facebook/000/073/884/aang_handsome.jpg',
            names: {
                spotify: 'Spotify',
                telegram: 'Telegram',
                github: 'GitHub',
                steam: 'Steam',
                discord: 'Discord',
                osu: 'OSU',
                minecraft: 'Minecraft',
                genkan: 'Genkan',
                tetr: 'TETR.IO'
            },
            statusNames: {
                dnd: 'Do not disturb'
            },
            services: false,
            serviceHover: '',
            accounts: {},
            activity: {},
            listServices: null,
            mainActivity: null,
            images: [
                'kotikinu',
                'utya3d',
                'twerking'
            ]
        }
    },
    methods: {
        async loadServices() {
            let list = await this.fetch('/services');
            this.listServices = list;
        },
        async serviceAccount(type, id, key) {
            if (this.accounts[`${type}:${id}`]) return this.serviceActivity(type, id, key);
            let data = await this.fetch(`/services/account/${type}/${key}`), account;
            switch(type) {
                case "spotify":
                    account = { avatar: data.images[0].url, username: data.display_name, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: data.external_urls.spotify }] };
                    break;
                case "github":
                    account = { avatar: data.avatar_url, username: data.login, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: data.html_url }] };
                    break;
                case "telegram":
                    account = { avatar: this.getImage(data.avatar), username: `${data.first_name} ${data.last_name}`, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: `https://t.me/${data.username}` }] };
                    break;
                case "discord":
                    account = { avatar: data.avatarURL, username: data.username, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: `https://discord.com/users/${data.id}` }] };
                    break;
                case "steam":
                    account = { avatar: data.avatarfull, username: data.personaname, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: data.profileurl }] };
                    break;
                case "osu":
                    account = { avatar: data.avatar, username: data.username, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: data.url }] };
                    break;
                case "minecraft":
                    account = { ...data, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: data.url }]};
                    break;
                case "email":
                    account = { avatar: null, username: data.username, buttons: [{ label: 'Send an email', icon: 'uil uil-envelope-upload', url: `mailto:${data.username}` }]};
                    break;
                case "genkan":
                    account = { avatar: `https://api.genkan.xyz/images/${data.avatar.image.id}?full=true`, username: data.nickname, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: `https://genkan.xyz/users/${data.username}` }] }
                    break;
                case "tetr":
                    console.log(data);
                    account = { avatar: `https://tetr.io/user-content/avatars/${data._id}.jpg`, username: data.username, buttons: [{ label: 'Profile', icon: 'uil uil-user', url: `https://ch.tetr.io/u/${data.username}` }] }
                    break;
            }
            this.accounts[`${type}:${id}`] = account;
            this.activity[`${type}:${id}`] = { buttons: account?.buttons };
            this.serviceActivity(type, id, key);
        },
        async serviceActivity(type, id, key) {
            let data = await this.fetch(`/services/activity/${type}/${key}`);
            if (data?.activity === false) return;
            this.activity[`${type}:${id}`] = { ...data, buttons: [...this.accounts[`${type}:${id}`]?.buttons, ...data?.buttons || []] };
            return setTimeout(() => !this.serviceHover || this.serviceHover?.length < 1 ? null : this.serviceActivity(type, id, key), 5000)
        },
        focusService(service, block) {
            this.serviceHover = [service, block ? 'block' : ''];
        },
        blurService(service) {
            setTimeout(() => this.serviceHover[0] === service && this.serviceHover[1] !== 'block' ? this.serviceHover = '' : null, 200)
        },
        async loadActivity() {
            let activity = await this.fetch('/activity');
            this.mainActivity = activity;
            if (!this.getContent?.activity) return;
            setTimeout(() => this.loadActivity(), 5000);
        }
    },
    async mounted() {
        this.loadServices();

        this.loadActivity();
    }
}
</script>

<style lang="scss" scoped>

.show, .hide {
    opacity: 0;
}

.table {
    padding: 4px 8px;
    color: var(--C1);
    text-shadow: 0 0 5px var(--C1);
    border-radius: 5px;
    border: 1px solid var(--bg-2);
    box-shadow: 0 0 5px 1px var(--C1);
    background: var(--dimming);
    user-select: none;
}

.page.main .block {
    height: 100%;
    
    .services {
        position: absolute;
        left: 16px;
        transition: .2s;
        z-index: 100;

        &.open {
            padding: 8px;
            max-height: 90%;
            border-radius: 5px;
            background: var(--dimming);
            overflow-x: hidden;

            li {
                .button {
                    // margin: 0 0 4px 0;
                    padding: 0 12px;
                    width: 100%;
                    text-align: left;
                    // border-bottom: 1px solid var(--bg-2);
                    justify-content: flex-start;
                    background: var(--T) !important;

                    span {
                        display: block;
                        margin: 0 0 0 8px;
                        font-size: 12px;
                    }
                }

                .block {
                    display: block;
                    position: relative;
                    left: 0;
                }
            }
        }

        .service {
            margin: 0 0 8px 0;
            position: relative;

            .button {
                cursor: pointer;
                display: flex;
                width: 32px;
                height: 32px;
                border-radius: 5px;
                border: 1px solid var(--T);
                align-items: center;
                justify-content: center;
                transition: .2s;
                box-sizing: border-box;

                &:hover {
                    background: var(--dimming);
                }

                span {
                    display: none;
                }
            }

            // .button:hover + .block, .block:hover {
            //     display: block;
            // }

            .block {
                // display: none;
                width: 196px;
                position: absolute;
                top: 0px;
                left: 42px;
                transition: all .2s;

                .account, .activity, .buttons {
                    padding: 8px;
                    border-radius: 5px;
                    background: var(--bg-2);

                    img {
                        border-radius: 5px;
                        object-fit: cover;
                        object-position: 50% 50%;
                    }
                }

                .account {
                    display: flex;
                    align-items: center;

                    img {
                        margin: 0 8px 0 0;
                        width: 28px;
                        height: 28px;
                    }

                    div {
                        width: 100%;
                        font-size: 14px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                .activity {
                    display: flex;
                    margin: 4px 0 0 0;
                    align-items: center;

                    &.mini {
                        .image {
                            img:nth-child(1) {
                                width: 32px;
                                height: 32px;
                            }
                        }
                    }

                    .image {
                        margin: 0 16px 0 0;
                        width: 48px;
                        position: relative;

                        img:nth-child(1) {
                            width: 48px;
                            height: 48px;
                        }

                        img:nth-child(2) {
                            width: 16px;
                            height: 16px;
                            position: absolute;
                            right: -15px;
                            bottom: -8px;
                            border: 5px solid var(--bg-2);
                            border-radius: 50%;
                        }
                    }

                    .image + div {
                        color: var(--color-2);
                        font-size: 14px;

                        div:nth-child(1) {
                            color: var(--color);
                            font-weight: 700;
                        }
                    }
                }

                .buttons {
                    display: flex;
                    padding: 4px;
                    margin: 4px 0 0 0;
                    align-items: center;
                    justify-content: center;

                    li {
                        cursor: pointer;
                        padding: 4px;
                        width: 100%;
                        border-radius: 5px;
                        transition: .2s;
                        text-align: center;

                        &:hover {
                            background: var(--dimming);
                        }
                    }
                }
            }

            &:last-child {
                margin: 0;
            }
        }
    }

    .content {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;

        .info {
            // min-width: 540px;
            text-align: center;
            // border-right: 1px solid var(--dimming);

            h1 {
                margin: 0 0 4px 0;
                position: relative;
                font-size: 64px;

                .status {
                    position: absolute;
                    top: 8px;
                    left: -32px;
                }
            }

            .text {
                color: var(--color-2);
            }
        }

        .video {
            margin: 0 0 0 64px;
            width: 320px;
        }

        .activity {
            margin: 0 0 0 64px;
            min-width: 376px;
        }
    }

    .bottom {
        display: flex;
        position: absolute;
        left: 50%;
        bottom: 16px;
        color: var(--color-2);
        font-size: 14px;
        align-items: center;
        transform: translateX(-50%);
        z-index: 10;

        .key {
            margin: 0 8px;
        }
    }

    .status {
                display: flex;
                margin: 0 0 12px 0;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                align-items: center;
                justify-content: flex-end;

                div {
                    margin: 0 12px;
                    width: 12px;
                    height: 12px;
                    border-radius: 3px;
                    // border: 5px solid var(--dimming);
                    transform: rotate(45deg);
                    transition: .2s;
                }

                &.online {
                    div {
                        box-shadow: 0 0 0 5px var(--C2-alt);
                        background: var(--C2);
                        animation: AnimationStatusOnline 2s ease-in-out infinite;
                    }
                }

                &.idle {
                    color: var(--C3);

                    div {
                        box-shadow: 0 0 0 5px var(--C3-alt);
                        background: var(--C3);
                        animation: AnimationStatusIdle 2s ease-in-out infinite;
                    }
                }

                &.dnd {
                    text-decoration: var(--bg) line-through;

                    div {
                        box-shadow: 0 0 0 5px var(--C5-alt);
                        background: var(--C5);
                        animation: AnimationStatusDnd 2s ease-in-out infinite;
                    }
                }

                &.offline {
                    color: var(--color-3);

                    div {
                        box-shadow: 0 0 0 5px var(--bg-2);
                        background: var(--dimming);
                        animation: AnimationStatusOffline 2s ease-in-out infinite;
                    }
                }

                @keyframes AnimationStatusOnline {
                    from, to {
                        box-shadow: 0 0 0 0px var(--T);
                    }
                    50% {
                        border-radius: 50%;
                        box-shadow: 0 0 0 5px var(--C2-alt);
                        transform: rotate(-45deg);
                    }
                }

                @keyframes AnimationStatusDnd {
                    from, to {
                        box-shadow: 0 0 0 0px var(--T);
                        transform: scale(.7);
                    }
                    50% {
                        border-radius: 0px;
                        box-shadow: 0 0 0 5px var(--C5-alt);
                        transform: rotate(-135deg) scale(1.1);
                    }
                }

                @keyframes AnimationStatusIdle {
                    from, to {
                        border-radius: 50%;
                        box-shadow: 0 0 0 0px var(--T);
                        transform: scale(.5);
                    }
                    50% {
                        border-radius: 5px;
                        box-shadow: 0 0 0 5px var(--C3-alt);
                        transform: scale(1);
                    }
                }

                @keyframes AnimationStatusOffline {
                    from, to {
                        box-shadow: 0 0 0 0px var(--bg-3);
                    }
                    50% {
                        box-shadow: 0 0 0 5px var(--bg-2);
                    }
                }
            }
}

@media (max-width: 760px) {
    .page.main {
        .content {
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            .info {
                text-align: center;
            }

            .activity {
                margin: 16px 0 0 0 !important;
                min-width: 90%;
            }

            .video {
                margin: 0px !important;
            }
        }
    }
}

</style>