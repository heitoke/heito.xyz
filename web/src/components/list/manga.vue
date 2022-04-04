<template>
    <div class="manga">
        <ul v-if="list">
            <li v-for="block of list.filter(item => item.title.en_name.toLowerCase().includes(text.toLowerCase())).sort((a, b) => sort ? a.title.en_name < b.title.en_name : a.title.en_name > b.title.en_name)" :key="block"
                @click="redirect(`https://remanga.org/manga/${block.title.dir}`)"
            >
                <div class="bg" :style="{ 'background-image': `url('https://api.remanga.org${block.title.img.high}')` }">
                    <div class="progress">{{ block.read_progress }}/{{ block.read_progress_total }}</div>
                </div>
                <div class="header">
                    <div class="name">{{ block.title.en_name }}</div>
                    <div class="readed">Readed {{ block.read_progress }} out of {{ block.read_progress_total }}</div>
                    <div class="stats">
                        <div class="like">
                            <i class="uil uil-heart-alt" style="color: var(--C5);"></i>
                            <span>{{ block.title.total_votes }}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: 'ListBlockManga',
    components: {},
    computed: {},
    props: {
        text: { type: String },
        sort: { type: Boolean }
    },
    data() {
        return {
            type: false,
            list: null,
            names: [
                'Read',
                'In plans',
                'Readed',
                'Postponed',
                'Dropped',
                'Not interested'
            ]
        }
    },
    methods: {
        async getList(type) {
            let data = await this.fetch(`/list/manga?type=${type}`);
            if (data?.content?.length > 0) {
                this.$emit(`onEvent`, {
                    service: {
                        name: 'ReManga',
                        url: 'https://remanga.org',
                        icon: 'https://remanga.org/icon.png'
                    },
                    categories: data.props.bookmark_types.map(item => {
                        return { ...item, name: this.names[item.id], click: () => this.getList(item.id) }
                    }),
                    value: type
                });
                this.list = data.content;
            }
        }
    },
    mounted() {
        this.getList(0)
    }
}
</script>

<style lang="scss"></style>