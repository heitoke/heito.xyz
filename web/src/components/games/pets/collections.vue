<template>
    <div class="collections">
        <ul class="filters">
            <li :ui-title="`Сортировать по ${filters.sort ? 'убыванию' : 'возрастанию'}`" @click="filters.sort = !filters.sort">
                <i :class="filters.sort ? 'uil uil-sort-amount-up' : 'uil uil-sort-amount-down'"></i>
            </li>
            <li ui-title="Вид" @click="filters.blocks_type = !filters.blocks_type">
                <i :class="filters.blocks_type ? 'uil uil-align-alt' : 'uil uil-apps'"></i>
            </li>
            <li ui-title="Избранные" @click="filters.type = filters.type === 1 ? 0 : 1"
                :class="{ 'active': filters.type === 1 }" style="color: var(--C1);"
            >
                <i class="uil uil-star"></i>
            </li>
            <li ui-title="По дате" @click="filters.type = filters.type === 2 ? 0 : 2"
                :class="{ 'active': filters.type === 2 }"
            >
                <i class="uil uil-clock"></i>
            </li>
            <li ui-title="По названию" @click="filters.type = filters.type === 3 ? 0 : 3"
                :class="{ 'active': filters.type === 3 }"
            >
                <i class="uil uil-letter-english-a"></i>
            </li>
            <li ui-title="По кол-ву" @click="filters.type = filters.type === 4 ? 0 : 4"
                :class="{ 'active': filters.type === 4 }"
            >
                <i class="uil uil-list-ol"></i>
            </li>
            <li ui-title="По уровню" @click="filters.type = filters.type === 5 ? 0 : 5"
                :class="{ 'active': filters.type === 5 }"
            >
                <i class="uil uil-flask"></i>
            </li>
            <input type="text" placeholder="Поиск">
        </ul>
        <ul :class="{ 'list': true, 'grid': filters.blocks_type }">
            <li class="pet" v-for="(pet, idx) of new Array(123)" :key="(pet, idx)">
                <div class="rare deluxe"></div>
                <div class="setting" @click="settingPet = true">
                    <i class="uil uil-ellipsis-v"></i>
                </div>
                <img src="https://avatars.mds.yandex.net/i?id=af4c2cca7106af680c17b309f0f3e952-4393175-images-thumbs&ref=rim&n=33&w=100&h=100" alt="">
                <div class="name">Cat #{{ idx + 1}}</div>
                <div class="count" ui-title="Кол-во">5332</div>
            </li>
        </ul>
        <div class="setting-pet" v-if="settingPet">
            <div class="pet">
                <div class="image">
                    <img src="https://avatars.mds.yandex.net/i?id=af4c2cca7106af680c17b309f0f3e952-4393175-images-thumbs&ref=rim&n=33&w=100&h=100" alt="">
                    <div :class="`rare ${settingPet.rare}`"></div>
                </div>
                <input type="text" class="name" :value="settingPet.name || `Cat #${settingPet.id}`">
                <div class="level">{{ settingPet.level }}</div>
                <div class="count" ui-title="Кол-во">{{ settingPet.count }}</div>
            </div>
            <div class="setting">
                <ul class="stats">
                    <li>
                        <i class="uil uil-flask"></i>
                        <span>+120 xp</span>
                    </li>
                    <li>
                        <i class="uil uil-bill"></i>
                        <span>+230 HX</span>
                    </li>
                </ul>
                <div class="up-info">
                    <i class="uil uil-flask"></i>
                    <span>+20 xp</span>
                    <i class="uil uil-bill"></i>
                    <span>+30 HX</span>
                    <div class="button">
                        <i class="uil uil-arrow-up"></i>
                    </div>
                </div>
            </div>
            <ul class="buttons">
                <li class="close">
                    <i class="uil uil-times"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'GamePetsCollections',
    computed: mapGetters([]),
    data() {
        return {
            filters: {
                type: 0,
                sort: false,
                blocks_type: false
            },
            settingPet: {
                id: 1233,
                name: 'Good',
                count: 23,
                level: 20,
                rare: 'epic'
            }
        }
    },
    methods: {
        ...mapActions([])
    },
    mounted() {}
}

</script>

<style lang="scss">

.page.games .game.pets .category.collections {
    .filters {
        display: flex;
        padding: 8px 0 8px 16px;
        height: 24px;
        align-items: center;
        border-bottom: 1px solid var(--dimming-2);
         
        li {
            cursor: pointer;
            margin: 0 4px 0 0;
            min-width: 24px;
            min-height: 24px;
            text-align: center;
            line-height: 24px;
            border-radius: 3px;

            &:hover, &.active {
                background: var(--bg-3);
            }
        }
    }

    input[type="text"] {
        padding: 4px 12px;
        width: 100%;
        color: var(--color);
        border-radius: 3px;
        border: 1px solid var(--T);
        background: var(--T);
        transition: .2s;

        &:focus {
            background: var(--bg);
        }
    }

    .list {
        display: grid;
        padding: 8px;
        height: calc(100% - 24px - 32px);
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        overflow-x: hidden;

        .pet {
            display: flex;
            margin: 4px;
            padding: 12px;
            min-height: 96px;
            position: relative;
            border-radius: 5px;
            background: var(--dimming);
            align-items: center;
            flex-direction: column;
            transition: .2s;
            overflow: hidden;

            &:hover {
                box-shadow: 0 5px 5px -5px var(--color);
                transform: translateY(-4px);
            }

            &:hover .rare {
                top: -4px;
                left: -4px;
                border-radius: 25%;
                transform: rotate(25deg);
            }
            .rare {
                width: 16px;
                height: 16px;
                position: absolute;
                top: -6px;
                left: -6px;
                border-radius: 50%;
                background: var(--color);
                transition: .2s;

                &.epic   { background: linear-gradient(45deg, var(--C1), var(--C2)); }
                &.gold   { background: linear-gradient(45deg, var(--C3), var(--C5)); }
                &.green  { background: linear-gradient(45deg, var(--C2), var(--C3)); }
                &.deluxe { background: linear-gradient(45deg, var(--C1), var(--C5)); }
                &.red    { background: linear-gradient(45deg, var(--C5), var(--C4)); }
            }

            &:hover .setting {
                color: var(--color-2);
            }
            .setting {
                cursor: pointer;
                position: absolute;
                top: 4px;
                right: 4px;
                color: var(--T);
                font-size: 12px;
            }

            img {
                margin: 0 0 8px 0;
                width: 48px;
                height: 48px;
                border-radius: 50%;
            }

            .name {
                color: var(--color-2);
            }

            .count {
                margin: 8px 0 0 0;
                padding: 2px 4px;
                font-size: 10px;
                color: var(--C1);
                border-radius: 3px;
                background: var(--bg-2);
            }
        }
    }

    .setting-pet {
        display: flex;
        padding: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 5px;
        box-shadow: 0 0 5px 5px var(--dimming);
        animation: ShowGamePets .5s ease-in-out;
        background: var(--bg-2);
        transform: translate(-50%, -50%);

        i {
            margin: 0 4px 0 0;

            &.uil.uil-flask { color: var(--C2); }
            &.uil.uil-bill { color: var(--C6); }
        }

        .pet {
            display: flex;
            margin: 0 8px 0 0;
            align-items: center;
            flex-direction: column;

            input {
                margin: 4px 0;
                width: 96px;
                font-size: 12px;
                text-align: center;
            }

            .count {
                margin: 2px 0 0 0;
                padding: 2px 8px;
                font-size: 10px;
                color: var(--C1);
                border-radius: 3px;
                background: var(--dimming);
            }
        }

        .setting {
            .stats {
                display: grid;
                margin: 0 0 8px 0;
                text-align: center;
                grid-template-columns: 1fr 1fr;

                li {
                    margin: 4px 12px;
                    padding: 6px 0;
                    border-radius: 5px;
                    background: var(--dimming);

                    span {
                        font-size: 12px;
                    }
                }
            }

            .up-info {
                display: flex;
                margin: 4px 0 0 0;
                padding: 4px 8px;
                width: 196px;
                border-radius: 5px;
                align-items: center;
                justify-content: space-between;
                background: var(--dimming);

                span {
                    font-size: 13px;
                }

                .button {
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    text-align: center;
                    line-height: 24px;
                    border-radius: 5px;
                    background: var(--C2-alt);

                    i { margin: 0; }

                    &:hover {
                        transform: scale(1.1);
                    }

                    &:active {
                        transform: scale(.8) ;
                    }
                }
            }
        }
    }

    .buttons {
        margin: 0 0 0 8px;

        li {
            cursor: pointer;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            border-radius: 5px;

            i {
                margin: 0;
            }

            &.close {
                background: var(--C5-alt);
            }
        }
    }
}

</style>
