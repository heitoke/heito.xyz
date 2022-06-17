<template>
    <div class="services-list">
        <transition-group tag="ul" class="list" enter-active-class="fade-show" leave-active-class="fade-hide">
            <li v-for="(service, idx) of services" :key="(service, idx)"
                :class="['service', { off: !service.isActive, deleted: service['deleted'] }]"
                @contextmenu="setContextMenu([`service:setting:${idx}`])"
            >
                <div class="type">
                    <icon :data="serviceTypes[service.type]"/>
                </div>
                <div class="name" @mouseenter="setToolpic(['Name'])">{{ names[service.type] }}</div>
                <div class="service-key" @mouseenter="setToolpic(['Key'])">{{ service.key }}</div>
                <div :class="['up', { disable: !services[idx - 1] }]"
                    @click="!services[idx - 1] ? null : move(idx)"
                    @mouseenter="setToolpic([!services[idx - 1] ? 'Blocked' : 'Up'])"
                >
                    <i class="uil uil-angle-up"></i>
                </div>
                <div :class="['down', { disable: !services[idx + 1] }]"
                    @click="!services[idx + 1] ? null : move(idx, false)"
                    @mouseenter="setToolpic([!services[idx + 1] ? 'Blocked' : 'Down'])"
                >
                    <i class="uil uil-angle-down"></i>
                </div>

                <ContextMenu :name="`service:setting:${idx}`">
                    <ul>
                        <li @click="service.isActive = !service.isActive">
                            <i :class="`uil uil-${service.isActive ? 'minus' : 'plus'}`" :style="{ color: service.isActive ? 'var(--C5)' : 'var(--C2)' }"></i>
                            <span>{{ service.isActive ? 'Disable the' : 'Enable the' }} service</span>
                        </li>
                        <div class="line"></div>
                        <li @click="service['deleted'] = !service['deleted']">
                            <i class="uil uil-trash" style="color: var(--C5);"></i>
                            <span>Remove service</span>
                        </li>
                    </ul>
                </ContextMenu>
            </li>
        </transition-group>
        <div class="buttons">
            <Button text="Add new service" color="green"
                @click="setMenu(['ServicesAddMenu', { save: add }])"
            />
            <Button text="Save" color="green" v-if="this.oldServices !== JSON.stringify(this.services)" @click="save()"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServicesList',
    components: {},
    computed: {},
    data() {
        return {
            image: 'https://i.kym-cdn.com/photos/images/facebook/000/073/884/aang_handsome.jpg',
            services: null,
            oldServices: [],
            names: {
                spotify: 'Spotify',
                telegram: 'Telegram',
                github: 'GitHub',
                steam: 'Steam',
                discord: 'Discord',
                osu: 'OSU',
                minecraft: 'Minecraft',
                email: 'E-Mail',
                genkan: 'Genkan',
                tetr: 'TETR.IO'
            }
        }
    },
    methods: {
        async load() {
            let list = await this.fetch(`/services?token=${this.getLocal?.token}`);
            this.services = list;
            this.oldServices = JSON.stringify(this.services);
        },
        add(type, key) {
            this.services = [ ...this.services,
                { type, id: this.generate(16), key, isActive: true }
            ]
        },
        async save() {
            let { status } = await this.fetch(`/services/update`, {
                token: this.getLocal?.token,
                data: this.services.filter(item => !item['deleted'])
            });
            if (status !== 200) return;
            this.oldServices = JSON.stringify(this.services);
        },
        move(id, up = true) {
            if (!this.services[up ? id - 1 : id + 1]) return;
            let save = this.services[up ? id - 1 : id + 1];
            this.services[up ? id - 1 : id + 1] = this.services[id];
            this.services[id] = save;
        }
    },
    mounted() {
        this.load();
    }
}
</script>

<style lang="scss" scoped>

.block.services-list {
    padding: 12px;
    max-width: 512px !important;
    min-width: 512px;
    border-radius: 5px;
    background: var(--bg);

    .list {
        display: flex;
        max-height: 80vh;
        flex-direction: column;
        row-gap: 8px;
        overflow-x: hidden;

        .service {
            display: flex;
            padding: 8px;
            border-radius: 5px;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            background: var(--dimming);
            transition: .2s;
            gap: 8px;

            &.off {
                background: var(--bg-2);
            }

            &.deleted {
                background: var(--bg-4);
            }

            .name {
                width: 25%;
                font-size: 14px;
            }

            .service-key {
                padding: 4px 8px;
                width: 100%;
                color: var(--T);
                font-size: 12px;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-radius: 5px;
                background: var(--bg);
                transition: .2s;
                overflow: hidden;

                &:hover {
                    color: var(--color-2);
                }
            }

            .type img {
                width: 18px;
                height: 18px;
            }

            .up, .down {
                cursor: pointer;
                color: var(--color-2);
                transition: .2s;

                &:not(.disable):hover {
                    color: var(--color);
                }

                &.disable {
                    cursor: default;
                    color: var(--bg-4) !important;
                }
            }

            .up:not(.disable):active {
                transform: scale(1.5);
            }
            .down:not(.disable):active {
                transform: scale(.7);
            }
        }
    }

    .buttons {
        display: flex;
        margin: 12px 0 0 0;
        align-items: center;
        column-gap: 12px;

        .field-button {
            width: 100%;
        }
    }
}

</style>