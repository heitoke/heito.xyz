<template>
    <header :style="{ padding: $route.meta?.pageOptions?.padding || '0 32px' }">
        <div class="logo">
            <img src="/favicon.ico" alt="Logo">

            <div>
                <NuxtLink to="/">heito.xyz</NuxtLink>

                <div class="online">
                    <span>Online:</span> 1
                </div>
            </div>
        </div>

        <Activities/>

        <div style="margin-left: auto;"></div>

        <Menu/>

        <User/>

        <div class="super">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </header>
</template>

<script lang="ts" setup>

import Activities from './Activities.vue';
import User from './User.vue';
import Menu from './Menu.vue';

</script>

<style lang="scss" scoped>

header {
    display: flex;
    width: 100vw;
    height: 64px;
    position: relative;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 100;

    .logo {
        display: flex;
        align-items: center;

        img {
            margin-right: 8px;
        }

        a {
            color: var(--text-primary);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }

        .online {
            color: var(--main-color);
            font-size: 12px;

            span {
                color: var(--text-secondary);
            }
        }
    }

    .super {
        cursor: pointer;
        display: flex;
        position: relative;
        width: 20px;
        height: 16px;
        flex-direction: column;
        justify-content: space-between;

        &:hover {
            div {
                background-color: var(--text-primary);
            }
        }

        div {
            width: 100%;
            height: 1px;
            border-radius: 5px;
            background-color: var(--text-secondary);
            transition: .2s;
        }
    }
}

</style>