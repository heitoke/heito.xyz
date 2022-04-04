<template>
    <li :class="`project-card ${data?.image ? '' : 'no-image'}`">
        <div class="bg" :style="{ 'background-image': `url('${data?.image}')` }"></div>
        <div class="header">
            <div class="title" @click="setMenu(['ProjectInfoMenu', data?.id])">{{ data?.title }}</div>
            <div class="description">{{ data?.description }}</div>
            <ul class="tags" v-if="data?.tags?.length > 0">
                <li v-for="tag of data?.tags?.slice(0, 4)" :key="tag">
                    <i class="uil uil-tag-alt"></i>
                    <span>{{ tag }}</span>
                </li>
            </ul>
        </div>
        <!-- <ul class="users" v-if="data.users.length > 0">
            <li class="count" @click="setMenu(['ProjectInfoMenu'])">
                <i class="uil uil-users-alt"></i>
                <span>{{ data.users.length }}</span>
            </li>
            <li v-for="user of data.users.slice(0, 4)" :key="user"
                :style="{ 'background-image': `url('${user}')` }"
            ></li>
        </ul> -->
    </li>
</template>

<script>

export default {
    name: 'ProjectCard',
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

<style lang="scss">

.project-card {
    display: flex;
    // padding: 12px;
    min-height: 196px;
    position: relative;
    border-radius: 5px;
    background-color: var(--dimming);
    transition: .2s;
    // overflow: hidden;

    &:hover {
        border-radius: 0 0 5px 5px;
        &:not(.no-image) { transform: translateY(50%); }
        z-index: 1000;
        
        &:not(.no-image) .bg {
            border-radius: 5px 5px 0 0;
            transform: translateY(-100%);
            transition: all .2s;

            &::after {
                opacity: 0;
            }
        }

        * {
            opacity: 1 !important;
        }
    }

    .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 5px;
        background-size: cover;
        background-position: 50% 50%;
        transition: all .2s;
        overflow: hidden;

        &::after {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            background: rgba(0, 0, 0, .6);
            transition: .2s;
        }
    }

    &.deleted {
        opacity: .3 !important;
    }

    .header {
        padding: 12px;
        width: 100%;
        // height: calc(100% - 24px);
        height: auto;
        position: relative;
        border-radius: 0 5px 5px 0;
        background-size: cover;
        background-position: 50% 50%;
        
        *:not(.title) {
            transition: .2s;
            opacity: 0;
        }

        .title {
            cursor: pointer;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            font-family: Avenir, Helvetica, Arial, sans-serif;
            text-transform: uppercase;
            word-break: break-all;

            &:hover { text-decoration: underline; }
        }

        .description {
            margin: 4px 0 0 0;
            // max-width: 70%;
            color: var(--color-2);
            font-size: 14px;
            word-break: break-all;
        }

        .tags {
            position: absolute;
            left: 12px;
            bottom: 12px;

            li:hover {
                background: var(--bg-2) !important;
            }
        }
    }

    .users {
        min-width: 48px;
        transition: all .2s;
        user-select: none;
        opacity: 0;

        li.count {
            display: flex;
            margin: 8px 2px;
            padding: 2px 4px;
            font-size: 14px;
            border-radius: 25px;
            align-items: center;
            justify-content: center;
            background: var(--bg-2);

            i {
                margin: 0 2px;
            }
        }

        li:not(.count) {
            cursor: pointer;
            margin: 8px auto;
            width: 28px !important;
            height: 28px !important;
            border-radius: 50%;
            background-size: cover;
            background-position: 50% 50%;
            transition: .2s;
        }
    }
}

</style>