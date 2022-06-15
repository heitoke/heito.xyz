<template>
    <div class="services-list">
        <ul class="list">
            <li v-for="(service, idx) of services" :key="(service, idx)"
                :class="['service', { off: !service.isActive, deleted: service['deleted'] }]"
                @contextmenu="openContextMenu([$event, `service:setting:${idx}`])"
            >
                <div class="name">{{ names[service.type] }}</div>
                <div class="service-key">{{ service.key }}</div>
                <div class="type">
                    <icon :data="serviceTypes[service.type]"/>
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
        </ul>
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
        max-height: calc(64px * 4);
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

            &.off {
                background: var(--bg-2);
            }

            &.deleted {
                background: var(--bg-4);
            }

            .name {
                margin: 0 0 0 8px;
                width: 25%;
                font-size: 14px;
            }

            .service-key {
                margin: 0 12px;
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