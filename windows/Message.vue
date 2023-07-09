<template>
    <div class="message">
        <header>
            <Icon :name="data?.icon" v-show="data?.icon"/>
            <div class="title" v-show="data?.title">{{ data?.title }}</div>
        </header>

        <Text class="text" :text="data?.text" v-show="data?.text"/>

        <div class="components" v-if="data?.components?.length! > 0">
            <component v-for="component in data?.components" :is="component.component"
                v-bind="component.props"
                v-on="Object.keys(component?.events || {}).length > 0 ? component?.events : null"
            />
        </div>
        
        <ul class="buttons" v-show="data?.buttons?.length! > 0">
            <Button v-for="btn of data?.buttons"
                :color="btn?.color || 'var(--main-color)'"
                @click="btn?.click ? btn?.click($event, data!, windowId!) : null"
            >
                <Icon :name="btn?.icon" v-show="btn?.icon"/>

                <span>{{ btn?.label }}</span>
            </Button>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IButton } from '~/components/content/NavBar.vue';
import type { IComponent } from '~/types/stores/contextMenu';

export interface IMessageButton extends Omit<IButton, 'click'> {
    click(event: MouseEvent, data: IMessage, windowId: number): void;
}

export interface IMessage {
    title?: string;
    icon?: string;
    text?: string;
    buttons?: Array<IMessageButton>;
    components?: Array<IComponent>;
}

const props = defineProps({
    windowId: { type: Number },
    data: { type: Object as PropType<IMessage> }
});

</script>

<style lang="scss" scoped>

.block.message {
    max-width: 512px;
    position: relative;

    header {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;

        .hx-icon {
            margin: 0 8px 0 0;
        }

        .title {
            font-size: 20px;
        }
    }


    .text {
        color: var(--text-secondary);
    }

    .components {
        margin: 12px 0 0 0;

        * {
            margin: 0 0 12px 0;
        }
    }

    ul.buttons {
        display: flex;
        margin: 12px 0 0 0;
        align-items: center;

        .ui-button {
            margin: 0 12px 0 0;

            &:last-child {
                margin: 0;
            }

            .hx-icon {
                margin: 0 8px 0 0;
            }

            span {
                white-space: nowrap;
            }
        }
    }
}

</style>