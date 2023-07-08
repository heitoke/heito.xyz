<template>
    <div class="setting">
        <div class="title">Setting</div>

        <NavBar :menu="menuButtons" @select="set"/>

        <!-- * Sections -->
        <!-- <ComponentsSlider :name="section" style="margin: 12px 0 0 0;"
            :components="[
                { name: 'personalization', component: personalization },
                { name: 'about', component: about }
            ]"
        /> -->

        <Text class="footer-alert" text="Beta"/>
    </div>
</template>

<script lang="ts" setup>

import NavBar, { type IButton } from '~/components/content/NavBar.vue';

// import ComponentsSlider from '~/components/content/ComponentsSlider.vue';

// import personalization from '~/components/windows/setting/Personalization.vue';
// import about from '~/components/windows/setting/About.vue';


const props = defineProps({
    windowId: { type: Number },
    data: { type: String }
});

const
    section = ref<string>('about'),
    swipe = ref<'left' | 'right'>('right');

const menuButtons: Array<IButton> = [
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
];


function set(btn: IButton) {
    let old = menuButtons.findIndex(b => b.value === section.value),
        now = menuButtons.findIndex(b => b.value === btn.value);

    swipe.value = old < now ? 'right' : 'left' 

    section.value = btn.value!;
}


onMounted(() => {
    section.value = menuButtons[0].value!;
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

    .footer-alert {
        margin: 12px 0 0 0;
        color: var(--text-secondary);
        font-size: 12px;
        text-align: center;
        user-select: none;
    }
}

</style>