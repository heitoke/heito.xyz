<template>
    <div class="components-slider">
        {{ width }}
        {{ height }}
        <Transition name="slide-fade" @enter="enter">
            <component class="slide" :is="getComponent"/>
        </Transition>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType, type Component } from 'vue';

export interface IComponent {
    name: string;
    component: Component;
}

export default defineComponent({
    name: 'ComponentsSlider',
    computed: {
        getComponent(): any {
            return this.components.find(c => c.name === this.name)?.component;
        }
    },
    props: {
        components: {
            type: Object as PropType<Array<IComponent>>,
            default: [],
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            swipe: 'right',
            width: '',
            height: '',
            hheight: ''
        }
    },
    watch: {
        name(newValue: string, oldValue: string) {
            let now = this.components.findIndex(c => c.name === oldValue),
                next = this.components.findIndex(c => c.name === newValue);

            if (next > now) this.swipe = 'right';
            else if (now > next) this.swipe = 'left';

            // this.setHeight();
        }
    },
    methods: {
        setHeight() {
            let el = (this.$el as Element)?.querySelector('.slide')?.getBoundingClientRect();

            this.width = el?.width + 'px';
            this.height = el?.height + 'px';
        },
        enter(el: Element) {
            if (!el) return;
            
            this.hheight = el.clientHeight + 'px';
        }
    },
    mounted() {
        // this.setHeight();
        
        this.enter(this.$el?.querySelector('.slide'));
    }
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