<template>
    <div class="pets">
        <ul class="categories-buttons">
            <li v-for="btn of categories" :key="btn" :ui-title="btn.label" uit-right
                :class="{ 'active': category === btn.name }"
                @click="category = btn.name; router(`.${btn.name}`)"
            >
                <i :class="btn.icon"></i>
            </li>
        </ul>
        <router-view v-slot="{ Component }"><component class="category" :is="Component"/></router-view>
    </div>
</template>

<script>

export default {
    name: 'GamePets',
    components: {},
    computed: {},
    data() {
        return {
            category: '',
            categories: [
                { name: '/', label: 'Коллекция', icon: 'uil uil-backpack' },
                { name: '/store', label: 'Магазин', icon: 'uil uil-shopping-bag' }
            ]
        }
    },
    sockets: {},
    methods: {},
    mounted() {
        this.category = this.categories[0].name;
    }
}
</script>

<style lang="scss">

.page.games .game.pets {
    display: flex;
    padding: 16px;
    width: 70%;
    height: 70vh;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 7px;
    box-shadow: 0 0 5px 5px var(--dimming-2);
    animation: ShowGamePets .5s ease-in-out;
    background: var(--bg-2);
    transform: translate(-50%, -50%);

    .categories-buttons {
        // margin: 0 16px 0 0;
        padding: 0 16px 0 0;
        height: 100%;
        border-right: 1px solid var(--dimming-2);

        li {
            cursor: pointer;
            margin: 0 0 4px 0;
            width: 28px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            border-radius: 5px;
            transition: .2s;

            &:hover, &.active {
                background: var(--bg);
            }

            &.active {
                box-shadow: 0 0 2px 2px var(--dimming-2) inset;
            }
        }
    }

    .category {
        width: 100%;
    }
}

@keyframes ShowGamePets {
    from { transform: translate(-50%, -50%) scale(.7); }
}

</style>