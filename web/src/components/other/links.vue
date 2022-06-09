<template>
    <ul class="links">
        <li v-for="(link, idx) of links" :key="(link, idx)"
            @click="redirect(link.url)"
            @contextmenu="openContextMenu([$event, `link:edit:${idx}`])"
        >
            <i :class="link.icon ? link.icon : 'uil uil-link'"></i>
            <span>{{ link.label }}</span>

            <!-- ContextMenu -->

            <ContextMenu :name="`link:edit:${idx}`" v-if="getRole">
                <ul>
                    <li @click="setMenu(['SettingsAddLinkMenu', { title: 'Edit Link', button: 'Edit', ...link, save: val => $emit('onEvent', edit(val, link, idx)) } ])">
                        <i class="uil uil-pen" style="color: var(--C2);"></i>
                        <span>Edit link</span>
                    </li>
                    <div class="line"></div>
                    <li @click="list = list.filter(item => item.url !== link.url)">
                        <i class="uil uil-trash" style="color: var(--C5);"></i>
                        <span>Delete link</span>
                    </li>
                </ul>
            </ContextMenu>
        </li>
    </ul>
</template>

<script>

export default {
    name: 'BlockLinks',
    components: {},
    computed: {},
    props: {
        links: { type: Object },
        role: { type: Boolean },
        index: { type: Number, default: 0 }
    },
    data() {
        return {}
    },
    methods: {
        edit(newLink, oldLink, idx) {
            Object.keys(oldLink).forEach(item => oldLink[item] = newLink[item] || oldLink[item]);
            return { link: oldLink, idx };
        }
    },
    mounted() {}
}
</script>

<style lang="scss" scoped>

.links {
    li {
        cursor: pointer;
        display: flex;
        padding: 8px 14px;
        color: var(--color-2);
        align-items: center;
        border-radius: 5px;
        transition: .2s;

        &:hover {
            color: var(--color);
            background: var(--dimming);

            i { color: var(--main-color); }
        }

        i {
            margin: 0 8px 0 0;
            font-size: 20px;
            transition: .2s;
        }

        img {
            margin: 0 8px 0 0;
            width: 28px;
            height: 28px;
            border-radius: 5px;
            object-fit: cover;
        }

        span {
            font-size: 14px;
        }
    }
}

</style>