<template>
    <footer>
        <div class="mini-logo">
            <Icon name="logo"/>
        </div>
        
        <div class="content">
            <Select label="Language" position="top" :value="$lang.name"
                :menu="getListLangs"
                @select="$lang.set($event.value)"
            />
        </div>
    </footer>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import type { TLangName } from '../plugins/langs';

export default defineComponent({
    name: 'Footer',
    components: {},
    computed: {
        getListLangs() {
            return Object.keys(this.$lang.list).map(key => ({
                label: this.$lang.list[key as TLangName].name,
                text:  this.$lang.name === key ? 'Used' : this.$lang.list[key as TLangName][this.$lang.name],
                icon: 'translate',
                value: key,
                click: () => {
                    this.setLang(key as TLangName);
                }
            }))
        }
    },
    data: () => ({}),
    watch: {},
    methods: {
        setLang(name: TLangName) {
            this.$lang.set(name);

            console.log(name, this.$lang.name);
            
            
            this.$local.set('lang', name);
            document.querySelector('html')?.setAttribute('lang', name);
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

footer {
    margin: 64px 0 0 0;
    width: 100%;

    .mini-logo {
        display: flex;
        align-items: center;
        box-sizing: border-box;

        @keyframes Icon {
            from {
                transform: rotate(0);
            }
            to {
                transform: rotate(360deg);
            }
        }

        i {
            margin: 0 12px;
            color: var(--main-color);
            font-size: 20px;
            animation: Icon 1s ease-in-out infinite;
        }

        &::after, &::before {
            content: " ";
            width: 100%;
            border-bottom: 1px solid var(--background-secondary);
            box-sizing: border-box;
        }
    }

    .content {
        display: flex;
        padding: 5% 10%;
    }
}

</style>