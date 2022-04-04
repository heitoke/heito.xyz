<template>
    <div class="service-account">
        <img v-if="data.avatar" :src="data.avatar">
        <div>{{ data.username }}</div>
    </div>
</template>

<script>
export default {
    name: 'ServicesAccount',
    components: {},
    computed: {},
    props: {
        data: { type: Object }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

.service-account {
    display: flex;
    padding: 8px;
    border-radius: 5px;
    align-items: center;
    background: var(--bg-2);

    img {
        margin: 0 8px 0 0;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        object-fit: cover;
        object-position: 50% 50%;
    }

    div {
        width: 100%;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
}

</style>