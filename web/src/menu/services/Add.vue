<template>
    <div class="services-add">
        <Select :items="services.map(item => { return {
            label: item[0],
            icon: item[4] || item[1],
            value: item[2]
        } })" icon="fa" @onEvent="type = $event.value"/>
        <div v-if="type">
            <div class="text">{{ services.find(item => item[2] === type)[3] }}</div>
            <Text @onEvent="value = $event"/>
            <Button text="Add service" style="margin: 12px 0 0 0;" @click="closeMenu(pos); data.save(type, value);"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServicesAdd',
    components: {},
    computed: {},
    props: {
        data: { type: Object },
        pos: Number
    },
    data() {
        return {
            type: '',
            value: '',
            services: [
                ['Spotify', ['fab', 'spotify'], 'spotify', 'Refresh Token'],
                ['Telegram', 'uil uil-telegram', 'telegram', 'User ID'],
                ['GitHub', ['fab', 'github'], 'github', 'Login'],
                ['Steam', ['fab', 'steam'], 'steam', 'User ID'],
                ['Discord', ['fab', 'discord'], 'discord', 'User ID'],
                ['OSU', null, 'osu', 'Username', 'https://osu.ppy.sh/favicon-32x32.png'],
                ['Minecraft', null, 'minecraft', 'UUID', 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/apple-icon-180x180.png']
            ]
        }
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

.block.services-add {
    padding: 12px;
    max-width: 256px !important;
    min-width: 256px;
    border-radius: 5px;
    background: var(--bg);

    .text {
        margin: 8px 0;
        color: var(--color-2);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
    }
}

</style>