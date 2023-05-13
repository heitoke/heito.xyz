<template>
    <div class="setting">
        <div class="title">Setting</div>
        <NavBar :menu="menuButtons" @select="set"/>

        <!-- * Sections -->
        <ComponentsSlider :name="section.value" style="margin: 12px 0 0 0;"
            :components="[
                { name: 'personalization', component: personalization },
                { name: 'about', component: about }
            ]"
        />
        <!-- <Transition :name="`slide-${swipe}`">
            <component :is="sections[section.value]"/>
        </Transition> -->
    </div>
</template>

<script lang="ts" setup>

import NavBar, { IButton } from '../components/content/NavBar.vue';

import ComponentsSlider from '../components/content/ComponentsSlider.vue';

import personalization from '../components/windows/setting/Personalization.vue';
import about from '../components/windows/setting/About.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

interface IData {
    section: IButton | any;
    swipe: 'right' | 'left';
    menuButtons: any[];
}

export default defineComponent({
    name: 'WindowSetting',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        data: { type: String }
    },
    data(): IData {
        return {
            section: {},
            swipe: 'right',
            menuButtons: [
                {
                    icon: 'brush',
                    label: 'Personalization',
                    value: 'personalization'
                },
                {
                    icon: 'info-circle',
                    label: 'About',
                    value: 'about'
                }
            ]
        }
    },
    watch: {},
    methods: {
        set(btn: IButton) {
            let old = this.menuButtons.findIndex(b => b.value === this.section),
                now = this.menuButtons.findIndex(b => b.value === btn.value);

            this.swipe = old < now ? 'right' : 'left' 

            this.section = btn;
        }
    },
    mounted() {
        this.section = this.menuButtons[0];
    }
});

</script>

<style lang="scss" scoped>

.slide-right-enter-active, .slide-left-enter-active,
.slide-right-leave-active, .slide-left-leave-active {
    width: 0px !important;
    height: 0px !important;
    transition: .2s;
    opacity: 0;
}

.slide-right-enter-active {
    transform: translateX(100%);
}
.slide-right-leave-active {
    transform: translateX(-100%);
}

.slide-left-enter-active {
    transform: translateX(-100%);
}
.slide-left-leave-active {
    transform: translateX(100%);
}

.block.setting {
    position: relative;
    overflow: hidden;

    .title {
        margin: 0 0 12px 0;
        font-size: 20px;
    }
}

</style>