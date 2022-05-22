<template>
    <li :class="`blog-card ${type} ${data['public'] ? '' : 'private'}`">
        <img v-if="data?.image" :src="data?.image">
        <div class="header">
            <div class="title">{{ data?.title }}</div>
            <div class="description">{{ data?.description }}</div>
        </div>
    </li>
</template>

<script>

export default {
    name: 'BlogCard',
    components: {},
    computed: {},
    props: {
        data: { type: Object },
        type: { type: String, default: 'default' }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss">

.blog-card {
    cursor: pointer;
    padding: 12px;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--dimming);
    transition: .2s;
    
    &.private {
        border: 1px solid var(--C5-alt) !important;
    }

    &:hover {
        box-shadow: 0 0 5px 2px var(--bg-2);
        border: 1px solid var(--bg-2);
    }

    &:active {
        transform: scale(.9);
    }

    img {
        border-radius: 5px;
        object-fit: cover;
        object-position: 50% 50%;
    }

    .title {
        display: -webkit-box;
        font-weight: 700;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .description {
        display: -webkit-box;
        color: var(--color-2);
        font-size: 12px;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    &.default {
        img {
            max-width: 100%;
            min-height: 128px;
        }
    }

    &.line {
        display: flex;
        align-items: center;

        img {
            margin: 0 12px 0 0;
            max-width: 128px;
            min-height: 100%;
        }
    }
}

</style>