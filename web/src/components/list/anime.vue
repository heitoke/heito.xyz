<template>
    <div class="anime">
        <ul v-if="list">
            <li v-for="block of list.filter(item => item?.title_original?.toLowerCase().includes(text.toLowerCase())).sort((a, b) => sort ? a?.title_original < b?.title_original : a?.title_original > b?.title_original)" :key="block"
                @click="redirect(`https://anixart.tv/release/${block?.id}`)"
            >
                <div class="bg" :style="{ 'background-image': `url('${block.image}')` }">
                    <div class="progress">{{ block.episodes_total }}</div>
                </div>
                <div class="header">
                    <div class="name">{{ block.title_original }}</div>
                    <div class="readed">Total episodes {{ block.episodes_total }}</div>
                    <div class="stats">
                        <div>
                            <i class="uil uil-bookmark"></i>
                            <span>{{ block.favorites_count }}</span>
                        </div>
                        <div>
                            <i class="uil uil-star" style="color: var(--C3);"></i>
                            <span>{{ block.grade.toFixed(1) }}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <Button text="Load more" style="margin: 16px 0;" @click="loadList()" v-if="loadMore"/>
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
            page: 0,
            list: null,
            loadMore: false
        }
    },
    methods: {
        async getList(type, page) {
            this.loadMore = false;
            let data = await this.fetch(`/list/anime/689045/${type}/${page}`);
            if (data?.content) {
                if (data?.content?.length > 0) {
                    this.list = data?.content;
                    this.loadMore = true;
                } else this.list = [];
                this.type = type;
                this.page = page;
                this.$emit('onEvent', {
                    service: {
                        name: 'Anixart',
                        url: 'https://anixart.tv/',
                        icon: 'https://anixart.tv/images/fav/favicon-32x32.png'
                    },
                    categories: [ 'Waching', 'In plans', 'Watched', 'Postroned', 'Dropped'].map((item, i) => { return { name: item, id: i + 1, click: () => this.getList(i + 1, 0) } }),
                    value: type
                    // buttons: [
                    //     {
                    //         component: 'Select',
                    //         items: [
                    //             { label: 'Name (A - Z)', icon: 'uil uil-letter-japanese-a', value: 'name' },
                    //             { label: 'Date of addition', icon: 'uil uil-plus', value: 'add' },
                    //             { label: 'Update date', icon: 'uil uil-redo', value: 'update' },
                    //             { label: 'Date of reading', icon: 'uil uil-book-open', value: 'read' }
                    //         ],
                    //         value: 'name',
                    //         on: () => {
                    //             console.log(1);
                    //         }
                    //     }
                    // ]
                })
            }
        },
        async loadList() {
            let data = await this.fetch(`/list/anime/689045/${this.type}/${this.page + 1}`);
            if (data?.content?.length < 1) this.loadMore = false;
            else {
                this.list = [...this.list, ...data?.content];
                this.page++;
            }
        }
    },
    mounted() {
        this.getList(1, 0);
    }
}
</script>

<style lang="scss" scoped>

.list-block.anime {
    ul {
        overflow: hidden;
    }
}

</style>