<template>
    <div class="components-slider" ref="root">
        <!-- <Transition name="slide-fade" @enter="enter">
        </Transition> -->
        <component class="slide" :is="getComponent"/>
    </div>
</template>

<script lang="ts" setup>

import { PropType, type Component } from 'nuxt/dist/app/compat/capi';

export interface IComponent {
    name: string;
    component: Component;
}

type TSwipe = 'right' | 'left';

const root = ref<HTMLElement | null>(null);

const props = defineProps({
    components: {
        type: Object as PropType<Array<IComponent>>,
        default: [],
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const
    swipe = ref<TSwipe>('right'),
    width = ref<string>(''),
    height = ref<string>(''),
    hheight = ref<string>('');


const getComponent = computed(() => {
    return props.components.find(component => component.name === props.name)?.component;
});


watch(() => props.name, (newValue: string, oldValue: string) => {
    let now = props.components.findIndex(component => component.name === oldValue),
        next = props.components.findIndex(component => component.name === newValue);

    if (next > now) swipe.value = 'right';
    else if (now > next) swipe.value = 'left';

    // this.setHeight();
});


function setHeight() {
    const el = root.value?.querySelector('.slide')?.getBoundingClientRect();

    width.value = el?.width + 'px';
    height.value = el?.height + 'px';
}

function enter(el: Element) {
    if (!el) return;
    
    hheight.value = el.clientHeight + 'px';
}


onMounted(() => {
    // enter(root.value?.querySelector('.slide')!);
});

</script>

<style lang="scss" scoped>

.slide-right-enter-active, .slide-left-enter-active,
.slide-right-leave-active, .slide-left-leave-active {
    width: 0px !important;
    height: 0px !important;
    transition: all .2s;
    opacity: 0;
}

.slide-right-enter-active {
    animation: Height var(--d) linear;
    transform: translateX(100%);
}
.slide-right-leave-active {
    transform: translateX(-100%);
    animation: Height var(--d) linear reverse;
}

.slide-left-enter-active {
    transform: translateX(-100%);
    animation: Height var(--d) linear reverse;
}
.slide-left-leave-active {
    animation: Height var(--d) linear;
    transform: translateX(100%);
}

.slide-fade {
  
  &-leave-active {
    transition: all .6s linear, transform .6s cubic-bezier(.64,.01,.67,.92);
  }
  
  &-enter-active {
    height: 0 !important;
    transition: all .6s linear, transform .6s cubic-bezier(.29,.15,.24,.97);
  }

  &-enter, 
  &-leave-to {
    opacity: 0;
  }
  
  &-enter {
    transform: translateX(20%); }
  &-leave-to {
    height: 0 !important;
    transform: translateX(-20%); }
  
  &-leave-active {
    width: 0 !important;
    position: absolute;
    top: 0;
    left: 0;
    height: 0 !important;
  }

}

@keyframes Height2 {
    from {
        padding: 0;
        max-height: 0px;
        opacity: 0;
    }

    to {
        height: v-bind(hheight);
    }
}


.components-slider {
    .slide {
  transition: height .5s ease-in-out;
  overflow: hidden;
  cursor: pointer;
  position: relative; 
        transition: .3s;
        // transition: height .5s ease-in-out;
    }
}

</style>