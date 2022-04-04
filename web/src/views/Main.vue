<template>
    <div class="main">
        <ul :class="['services', { open: services }]" v-if="listServices">
            <li class="service">
                <div class="button" @click="services = !services" @click.right="openContextMenu([$event, 'services:settings'])">
                    <i class="uil uil-apps"></i>
                    <span>Services</span>
                </div>

                <ContextMenu name="services:settings">
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
        <div class="content">
            <!-- <div class="table">
                ヘ <br>
                イ <br>
                ト
            </div> -->
            <div class="info">
                <h1 class="glitch font-3" data-glitch="heito.xyz">heito.xyz</h1>
                <div class="text">I live, die and live again...<br>And what do you do?</div>
            </div>
            <div class="model">
                <Renderer ref="renderer" width="540" height="540" :orbit-ctrl="{ autoRotate: true, enableDamping: true, dampingFactor: 0.05 }">
                    <Camera :position="randomModel.camera" />
                    <Scene background="#34333a">
                        <AmbientLight></AmbientLight>
                        <GltfModel
                            :position="randomModel.position"
                            :src="`/models/${randomModel.name}/scene.gltf`"
                            :rotation="randomModel.rotation"
                            :scale="randomModel.scale"
                        />
                    </Scene>
                </Renderer>
                <div class="status" v-if="randomModel.status">{{ randomModel.status() }}</div>
            </div>
        </div>
        <div class="bottom">
            Press the <div class="key" @click="setSuper('auto')">Tab</div> key
        </div>
    </div>
</template>

<script>

import ServiceAccount from '../components/services/account.vue'
import ServiceActivity from '../components/services/activity.vue'

export default {
    name: 'MainPage',
    components: { ServiceAccount, ServiceActivity },
    computed: {
        randomModel() {
            return this.models[Math.floor(Math.random() * this.models.length)];
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
                minecraft: 'Minecraft'
            },
            services: false,
            serviceHover: '',
            accounts: {},
            activity: {},
            listServices: null,
            models: [
                {
                    name: 'pine_tree',
                    camera: { y: 10, z: 20 },
                    status: () => {
                        return `🌲 10.213.232`;
                    }
                },
                {
                    name: 'sky',
                    camera: { y: 200, z: 410 }
                },
                {
                    name: 'redstone_lamp',
                    camera: { z: 150 },
                    position: { y: -25 }
                },
                {
                    name: 'mimi',
                    camera: { z: 4 }
                },
                {
                    name: 'pickaxe',
                    camera: { z: 50 },
                    rotation: { x: 190 },
                },
                {
                    name: 'glass',
                    camera: { z: 5 },
                    position: { y: -1 }
                },
                {
                    name: 'wheatley_core_from_portal_2',
                    camera: { z: 1.5 }
                },
                {
                    name: 'magic_portal',
                    camera: { z: 5 },
                    position: { y: -1.2 }
                },
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
        }
    },
    async mounted() {
        this.loadServices();
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

.page.main {
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
            min-width: 540px;
            text-align: center;
            border-right: 1px solid var(--dimming);

            h1 {
                margin: 0 0 4px 0;
                font-size: 64px;
            }

            .text {
                color: var(--color-2);
            }
        }

        .model {
            display: flex;
            align-items: center;
            flex-direction: column;

            .status {
                padding: 4px 8px;
                text-align: center;
                border-radius: 5px;
                background: var(--dimming);
            }
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
}

</style>